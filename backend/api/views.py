from django.shortcuts import render
import coreapi, coreschema
import math
from django.contrib.sites.shortcuts import get_current_site
import urllib.parse as urlparse
from urllib.parse import urlencode
from random import randint
from dateutil.parser import parse
from django.utils import timezone
from . import serializers
from django.utils import timezone
from . import models
from rest_framework import filters as rest_filters
from rest_framework import status, generics, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import rest_framework as filters
import importlib
from  utils.document import TXT, PDF, WordDocx
from . import permissions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import viewsets
from rest_framework.schemas import AutoSchema
from django.db.models import F, Func, Window, Q, Case, When
from django.contrib.postgres.aggregates import ArrayAgg
from django.conf import settings
import itertools

# Create your views here.

class MLModelFilter(filters.FilterSet):
    #source__name = filters.CharFilter(lookup_expr='exact')
    class Meta:
        model = models.MLModel
        fields = ('id','name','created_date','train','active')


class SourceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.SourceType.objects.all()
    serializer_class = serializers.SourceTypeSerializer


class SourceFilter(filters.FilterSet):
    class Meta:
        model = models.Source
        fields = ('id','name','active')

class HomeFilterSetting(filters.FilterSet):
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('gte'))
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('lte'))
    class Meta:
        model = models.Article
        fields = ("source","source__active")

class RandomUnclassified(APIView):

    permission_classes = (permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)

    model = openapi.Parameter('model',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="model id",
                            type=openapi.TYPE_INTEGER)
    response = openapi.Response('articles',
            openapi.Schema( type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT,
                                     properties={
                                        "title":openapi.Schema(type=openapi.TYPE_STRING),
                                         "clean_text":openapi.Schema(type=openapi.TYPE_STRING)
                                    })))
    error = openapi.Response("detail",
                             openapi.Schema(
                                type=openapi.TYPE_STRING,
                             ))
    @swagger_auto_schema(manual_parameters=[model], responses={200:response,404:error})
    def get(self, request, format=None):
        # todo(aj) filter by model id
        # either pass in source ids list to filter by or double nested
        model_id = self.request.query_params["model"]
        count = models.Article.objects.filter(organization=self.request.user.organization,
                                             classification=None,
                                              source__mlmodel=int(model_id)).count()
        if count == 0:
            return Response({"error":"no articles found for model " + str(model_id)},status.HTTP_404_NOT_FOUND)
        random_index = randint(0, count - 1)
        object = models.Article.objects.filter(organization=self.request.user.organization,
                                             classification=None,
                                               source__mlmodel=int(model_id))[random_index]
        serial = serializers.ArticleSerializer(models.Article.objects.filter(id=object.id),many=True)
        return Response(serial.data)


class HomeFilter(mixins.ListModelMixin, viewsets.GenericViewSet):
    permissions = (permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.SourceSerializer
    filterset_class = HomeFilterSetting

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization).\
            order_by("source__name").\
            distinct("source__name").\
            values("source__name", "source__id", "source__active", ).\
            annotate(name=F("source__name"),
                 id=F("source__id"),
                 active=F("source__active"))


def set_query_params(url, page):
    url_parts_next = list(urlparse.urlparse(url))
    nextpage_query_param = dict(urlparse.parse_qsl(url_parts_next[4]))
    params = {'page': page}
    nextpage_query_param.update(params)
    url_parts_next[4] = urlencode(nextpage_query_param)
    next_full_uri = urlparse.urlunparse(url_parts_next)
    return next_full_uri


class HomePage(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)

    start_date = openapi.Parameter('start_date',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="start date",
                            type=openapi.TYPE_STRING)

    end_date = openapi.Parameter('end_date',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="end date",
                            type=openapi.TYPE_STRING)

    source_id = openapi.Parameter('source_id',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="source_id",
                            type=openapi.TYPE_INTEGER)

    response = openapi.Response('articles',
            openapi.Schema( type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT,
                                     properties={
                                         "id":openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "title":openapi.Schema(type=openapi.TYPE_STRING),
                                         "clean_text":openapi.Schema(type=openapi.TYPE_STRING),
                                         "match":openapi.Schema(type=openapi.TYPE_INTEGER)
                                    })))
    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))

    def merge_values(self, values):
        grouped_results = itertools.groupby(values, key=lambda value: value['id'])
        merged_values = []
        for k, g in grouped_results:
            groups = list(g)
            merged_value = {}
            for group in groups:
                for key, val in group.items():
                    if not merged_value.get(key):
                        merged_value[key] = val
                    elif val != merged_value[key]:
                        if isinstance(merged_value[key], list):
                            if val not in merged_value[key]:
                                merged_value[key].append(val)
                        else:
                            old_val = merged_value[key]
                            merged_value[key] = [old_val, val]
            merged_values.append(merged_value)
        return merged_values

    def filter_matches(self,values,
                       source="",
                       start_upload_date="",
                       end_upload_date=""):
        new_values = []
        for i in values:
            if i["match"] is None:
                new_values.append(i)
            else:
                boolean_pred = []
                if source != "":
                    boolean_pred.append(i["match__source__id"] == int(source))
                if start_upload_date != "":
                    startdate = parse(start_upload_date)
                    boolean_pred.append(i["match__upload_date"] >= startdate)
                if end_upload_date != "":
                    enddate = parse(end_upload_date)
                    boolean_pred.append(i["match__upload_date"] <= enddate)
                if  all(boolean_pred):
                    new_values.append(i)
        return new_values

    @swagger_auto_schema(manual_parameters=[source_id,start_date,end_date], responses={200:response,404:error})
    def get(self, request, format=None):
        # todo(aj) filter by model id
        # either pass in source ids list to filter by or double nested
        source_id = self.request.query_params.get("source","")
        start_date = self.request.query_params.get("start_upload_date","")
        end_date = self.request.query_params.get("end_upload_date","")
        order_by = self.request.query_params.get("ordering","id")
        order_by = "id" if order_by == "" else order_by
        page = int(self.request.query_params.get("page", 1))
        page = 1 if page == "" else page
        match_id = self.request.query_params.getlist("match")
        filter_kwargs = {}
        if source_id != "":
            filter_kwargs["source_id"] = source_id
        if start_date != "":
            filter_kwargs["upload_date__gte"] = start_date
        if end_date != "":
            filter_kwargs["upload_date__lte"] = end_date
        if len(match_id) != 0:
            filter_kwargs["match__in"] = match_id


        sql_no_cummulate = models.Article.objects.filter(
                                                    **filter_kwargs
                                                    ).order_by("id").\
            select_related("source").values("upload_date",
                                             "source__name",
                                             "title",
                                             "id",
                                             "match",
                                            )

        # sort by id and remove similar so results stay consistent between sorts on the frontend
        # avoid pulling in entire model into memory
        nested_results = []
        nested_accumulate_children=[]

        level1_results=[]
        level1_accumulate_children=[]

        all_results=[]
        merged_results = self.merge_values(sql_no_cummulate.iterator())
        for i in merged_results:
            # use this for showing only level 1 down
            if i["id"] not in level1_accumulate_children:
                if i["id"] not in level1_results:
                    level1_results.append({"id":i["id"],
                        "upload_date": i["upload_date"],
                        "source__name": i["source__name"],
                        "title": i["title"]})
                if i["match"] is not None:
                    if isinstance(i["match"],int):
                        level1_accumulate_children.append(i["match"])
                    else:
                        level1_accumulate_children.extend(i["match"])
            # nested links hidden
            if i["id"] not in nested_accumulate_children:
                if i["id"] not in nested_results:
                    nested_results.append({"id": i["id"],
                        "upload_date": i["upload_date"],
                        "source__name": i["source__name"],
                        "title": i["title"]})
            if i["match"] is not None:
                if isinstance(i["match"],int):
                    nested_accumulate_children.append(i["match"])
                else:
                    nested_accumulate_children.extend(i["match"])
            # all results
            if i["id"] not in all_results:
                all_results.append( {"id": i["id"],
                        "upload_date": i["upload_date"],
                        "source__name": i["source__name"],
                        "title": i["title"]})

        #results = [{"id":i.id,
        #            "upload_date":i.upload_date,
        #            "source__name":i.source.name,
        #            "title":i.title}
        #           for i in sql if i.id not in i.cum_child_articles]
        # check valid sort column
        VALID_ORDER = ["id","title","source__name","upload_date"]
        test_order_by = order_by[1:] if order_by[0] == "-" else order_by
        if test_order_by not in VALID_ORDER:
             return Response({"detail":"order_by: " + order_by + " not valid"}, status=status.HTTP_400_BAD_REQUEST)

        # sort the data returned by the queryset ;
        # cannot do in queryset because if the window function cannot be used in a when clause
        list_of_models=[]
        if order_by[0] != "-":
            list_of_models = sorted(nested_results, key=lambda x: x[order_by])
        else:
            list_of_models = sorted(nested_results, key=lambda x: x[test_order_by],reverse=True)

        # retrieve page slicing
        total_count = len(list_of_models)
        total_pages = math.ceil(total_count / settings.REST_FRAMEWORK["PAGE_SIZE"])
        if page > total_pages:
            return Response({"detail":"page: " + str(page) + " out of bounds"},status=status.HTTP_400_BAD_REQUEST)
        start_slice = (page - 1) * settings.REST_FRAMEWORK["PAGE_SIZE"]
        end_slice = (page * settings.REST_FRAMEWORK["PAGE_SIZE"])

        # next and previous page
        next = page + 1 if page + 1 <= total_pages else None
        previous = page - 1 if page - 1 != 0 else None

        # edit query param for page for next and previous
        FULL_URL = request.build_absolute_uri('?')
        ABSOLUTE_ROOT =  request.build_absolute_uri('/')[:-1].strip("/")
        ABSOLUTE_ROOT_URL =  request.build_absolute_uri('/').strip("/")
        url = request.build_absolute_uri()
        next_full_uri = None
        if next is not None:
            next_full_uri = set_query_params(url, next)

        prev_full_uri = None
        if previous is not None:
            prev_full_uri = set_query_params(url, previous)

        # set sliced data for page
        sliced = list_of_models[start_slice:end_slice]
        # set sliced ids
        sliced_ids = [i["id"] for i in sliced]
        # retrieve sliced data from database in preserved order;
        preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(sliced_ids)])
        queryset_filter = models.Article.objects.filter(pk__in=sliced_ids).order_by(preserved).values(
                                            "upload_date",
                                             "source__name",
                                             "title",
                                             "id",
                                             "match",
                                             "match__upload_date",
                                             "match__source__id"
                                                )
        filtered = self.filter_matches(queryset_filter,
                                       source=source_id,
                                       start_upload_date=start_date,
                                       end_upload_date=end_date)
        merged_filtered = self.merge_values(filtered)
        queryset = models.Article.objects.filter(pk__in=sliced_ids).order_by(preserved)
        serial = serializers.ArticleSerializer(queryset, many=True)
        data = serial.data
        for i in data:
            q_id = i["id"]
            replace_list = list(filter(lambda d: d['id'] == q_id, merged_filtered))
            if len(replace_list) == 0:
                i["match"]=[]
            else:
                f_match = list(filter(lambda d: d['id'] == q_id, merged_filtered))[0]["match"]
                #todo(aj) fix merge function to set a list instead of int and none
                if f_match is None:
                    i["match"]=[]
                elif isinstance(f_match,int):
                    i["match"]=[f_match]
                else:
                    i["match"]=f_match

        # replace match in serial.
        response = {
            "count": len(list_of_models),
            "results": data,
            "next": next_full_uri,
            "previous": prev_full_uri,

        }
        return Response(response, status=status.HTTP_200_OK)


class OrgViewSet(viewsets.ModelViewSet):
    def perform_create(self, serializer):
        serializer.save(organization = self.request.user.organization)


class SourceViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.SourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active','url')
    filterset_class = SourceFilter

    def get_queryset(self):
        return models.Source.objects.filter(organization=self.request.user.organization)


class RssFilter(filters.FilterSet):
    class Meta:
        model = models.RSSSource
        fields = ('id','name','url','active')


class RssSourceViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.RssSourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active','url')
    filterset_class = RssFilter

    def get_queryset(self):
        return models.RSSSource.objects.filter(organization=self.request.user.organization)


class UploadSourceFilter(filters.FilterSet):
    class Meta:
        model = models.UploadSource
        fields = ('id','name','active')


class UploadSourceViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.UploadSourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active')
    filterset_class = UploadSourceFilter

    def get_queryset(self):
        return models.UploadSource.objects.filter(organization=self.request.user.organization)


jobsourcecols = ('id',
                  'name',
                  'active',
                  'script_path',
                  'working_dir',
                  'virtual_env_path',
                  'python_binary_fullpath',
                  'last_run',
                  'last_status',
                  'arguments',
                  )


class JobSourceFilter(filters.FilterSet):
    class Meta:
        model = models.JobSource
        fields = jobsourcecols


class JobSourceViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.JobSourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = jobsourcecols
    filterset_class = JobSourceFilter

    def get_queryset(self):
        return models.JobSource.objects.filter(organization=self.request.user.organization)



class MLModelViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.MLModelSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','created_date','enabled')
    filterset_class = MLModelFilter

    def get_queryset(self):
        return models.MLModel.objects.filter(organization=self.request.user.organization)


ARTICLE_SORT_FIELDS =('id','source','title','upload_date', 'source__name')


class ArticleFilter(filters.FilterSet):
    source__name = filters.CharFilter(lookup_expr='exact')
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('gte'))
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('lte'))
    match_article_id = filters.NumberFilter(field_name="match__id", lookup_expr=("exact"))

    ordering = filters.OrderingFilter(
        fields=[('source__name','source_name'),
                ('title','title'),
                ('upload_date','upload_date')]
    )
    class Meta:
        model = models.Article
        fields = ('id','source','title','upload_date', 'source__name','source__mlmodel__id',"match")


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.ArticleSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = ArticleFilter

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization)


class RSSArticleFilter(filters.FilterSet):
    class Meta:
        model = models.RSSArticle
        fields = ARTICLE_SORT_FIELDS


class RSSArticleViewSet(viewsets.ModelViewSet):
    permissions = (permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.RSSSerializer
    filter_backends = (filters.DjangoFilterBackend, rest_filters.OrderingFilter, rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = RSSArticleFilter

    def perform_create(self, serializer):
        instance = TXT(self.request.FILES['file'],self.request.data.encoding)
        text = instance.read()
        serializer.save(text=text,organization=self.request.user.organization)

    def get_queryset(self):
        return models.RSSArticle.objects.filter(organization=self.request.user.organization)


class HtmlArticleFilter(filters.FilterSet):
    class Meta:
        model = models.HtmlArticle
        fields = ARTICLE_SORT_FIELDS


class HtmlArticleViewSet(viewsets.ModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    queryset = models.HtmlArticle.objects.all()
    serializer_class = serializers.HtmlSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = HtmlArticleFilter

    def perform_create(self, serializer):
        instance = TXT(self.request.FILES['file'],self.request.data.encoding)
        text = instance.read()
        serializer.save(text=text,organization=self.request.user.organization)

    def get_queryset(self):
        return models.HtmlArticle.objects.filter(organization=self.request.user.organization)

class TxtArticleFilter(filters.FilterSet):
    class Meta:
        model = models.TxtArticle
        fields = ARTICLE_SORT_FIELDS


class TxtArticleViewSet(viewsets.ModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.TxtSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = TxtArticleFilter

    def perform_create(self, serializer):
        instance = TXT(self.request.FILES['file'],self.request.data.encoding)
        text = instance.read()
        serializer.save(text=text, organization=self.request.user.organization)

    def get_queryset(self):
        return models.TxtArticle.objects.filter(organization=self.request.user.organization)

class WordDocxArticleFilter(filters.FilterSet):
    class Meta:
        model = models.WordDocxArticle
        fields = ARTICLE_SORT_FIELDS

class WordDocxArticleViewSet(viewsets.ModelViewSet):
    permissions = (permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    queryset = models.WordDocxArticle.objects.all()
    serializer_class = serializers.WordDocxSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = WordDocxArticleFilter

    def perform_create(self, serializer):
        instance = WordDocx(self.request.FILES['file'])
        text = instance.read()
        serializer.save(text=text, organization=self.request.user.organization)

    def get_queryset(self):
        return models.WordDocxArticle.objects.filter(organization=self.request.user.organization)

class PDFArticleFilter(filters.FilterSet):
    class Meta:
        model = models.PDFArticle
        fields = ARTICLE_SORT_FIELDS

class PDFArticleViewSet(viewsets.ModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.PDFSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ARTICLE_SORT_FIELDS
    filterset_class = PDFArticleFilter

    def perform_create(self, serializer):
        password = self.request.data.password if 'password' in self.request.data else ''
        instance = PDF(self.request.FILES['file'],password=password)
        text = instance.read()
        serializer.save(text=text, organization=self.request.user.organization)

    def get_queryset(self):
        return models.PDFArticle.objects.filter(organization=self.request.user.organization)

class ArticleTypeViewSet(viewsets.ReadOnlyModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    queryset = models.ArticleType.objects.all()
    serializer_class = serializers.ArticleTypeSerializer

class ClassificationFilter(filters.FilterSet):
    #article__title = filters.CharFilter(lookup_expr='exact')
    class Meta:
        model = models.Classification
        fields = ( "mlmodel", "target", "article")

class ClassificationViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.ClassificationSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "mlmodel", "target", "article")
    filterset_class = ClassificationFilter

    def get_queryset(self):
        return models.Classification.objects.filter(organization=self.request.user.organization)
