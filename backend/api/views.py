from django.shortcuts import render
import coreapi, coreschema
from sklearn.metrics.pairwise import cosine_similarity
import math
import numpy as np
from django.contrib.sites.shortcuts import get_current_site
import urllib.parse as urlparse
from django.core import exceptions
from . import tasks
from urllib.parse import urlencode
from random import randint
from dateutil.parser import parse
from django.utils import timezone
from . import serializers
from django.utils import timezone
from . import models
from django_celery_results.models import TaskResult as TaskResultMdl
from rest_framework import filters as rest_filters
from rest_framework import status, generics, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import rest_framework as filters
from django_filters.groups import CombinedGroup

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
from utils import vector, read
from scipy.cluster import  hierarchy
import json

MAX_CLUSTER = 1000
# Create your views here.

class MLModelFilter(filters.FilterSet):
    modelversion__isnull = filters.BooleanFilter(field_name="modelversion",
                                                 lookup_expr="isnull",
                                                 distinct=True)
    class Meta:
        model = models.MLModel
        fields = ('id','name','created_date','train_lock','modelversion__isnull','active')


class SourceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.SourceType.objects.all()
    serializer_class = serializers.SourceTypeSerializer


class SourceFilter(filters.FilterSet):
    article___upload_date__gte = filters.IsoDateTimeFilter(field_name="article__upload_date",lookup_expr="gte")
    article___upload_date__lte = filters.IsoDateTimeFilter(field_name="article__upload_date", lookup_expr="lte")
    article = filters.NumberFilter(field_name="article__id")

    class Meta:
        model = models.Source
        fields = ('id','name','active',"mlmodel")


class RandomUnclassified(APIView):

    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

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


class ClassifPageFilterSetting(filters.FilterSet):
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('gte'))
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('lte'))
    class Meta:
        model = models.Article
        fields = ("source","source__active",
                  "classification__mlmodel__modelversion__active",
                  "classification__mlmodel",
                  "classification__target",
                  "classification__mlmodel__active"
                  )
        groups = [
                # many to many: must be grouped to work
                CombinedGroup(["classification__mlmodel", "classification__target","classification__mlmodel__active"])
        ]


class ClassifPageFilter(mixins.ListModelMixin, viewsets.GenericViewSet):
    permissions = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ClassifFilterSerializer
    filterset_class = ClassifPageFilterSetting
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization).\
            order_by("source__id",
                     "classification__mlmodel__id",
                     "classification__target",
                     "classification__mlmodel__active",
                    ).\
            distinct("source__id",
                    "classification__mlmodel__id",
                    "classification__target",
                    "classification__mlmodel__active",
                     ).\
            values("source__name",
                   "source__id",
                   "source__active",
                   "classification__mlmodel__name",
                   "classification__mlmodel__id",
                   "classification__target",
                   "classification__mlmodel__active",
                   ).\
            annotate(name=F("source__name"),
                 id=F("source__id"),
                 active=F("source__active"),
                  mlmodel = F("classification__mlmodel__name"),
                  mlmodel_id=F("classification__mlmodel__id"),
                  mlmodel_active=F("classification__mlmodel__active"),
                  target=F("classification__target")
                    )


class HomeFilterSetting(filters.FilterSet):
    start_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('gte'))
    end_upload_date = filters.IsoDateTimeFilter(field_name='upload_date', lookup_expr=('lte'))
    class Meta:
        model = models.Article
        fields = ("source","source__active",
                  "prediction__mlmodel__modelversion__active",
                  "prediction__mlmodel",
                  "prediction__target",
                  "prediction__mlmodel__active"
                  )
        groups = [
                # many to many: must be grouped to work
                CombinedGroup(["prediction__mlmodel", "prediction__target","prediction__mlmodel__active"])
        ]


class HomeFilter(mixins.ListModelMixin, viewsets.GenericViewSet):
    permissions = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.HomeFilterSerializer
    filterset_class = HomeFilterSetting
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization).\
            order_by("source__id",
                     "prediction__mlmodel__id",
                     "prediction__target",
                     "prediction__mlmodel__active",
                    ).\
            distinct("source__id",
                    "prediction__mlmodel__id",
                    "prediction__target",
                    "prediction__mlmodel__active",
                     ).\
            values("source__name",
                   "source__id",
                   "source__active",
                   "prediction__mlmodel__name",
                   "prediction__mlmodel__id",
                   "prediction__target",
                   "prediction__mlmodel__active",
                   ).\
            annotate(name=F("source__name"),
                 id=F("source__id"),
                 active=F("source__active"),
                  mlmodel = F("prediction__mlmodel__name"),
                  mlmodel_id=F("prediction__mlmodel__id"),
                  mlmodel_active=F("prediction__mlmodel__active"),
                  target=F("prediction__target")
                    )


def set_query_params(url, page):
    url_parts_next = list(urlparse.urlparse(url))
    nextpage_query_param = dict(urlparse.parse_qsl(url_parts_next[4]))
    params = {'page': page}
    nextpage_query_param.update(params)
    url_parts_next[4] = urlencode(nextpage_query_param)
    next_full_uri = urlparse.urlunparse(url_parts_next)
    return next_full_uri


class Upload(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)


    response = openapi.Response('model_info',
            openapi.Schema( type=openapi.TYPE_OBJECT,
                            properties={
                                    "job_id":openapi.Schema(type=openapi.TYPE_STRING),
                                    }))
    mlmodel = openapi.Parameter('mlmodel',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="start date",
                            type=openapi.TYPE_STRING,)
    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))

    @swagger_auto_schema(operation_description="create training job", manual_parameters=[mlmodel], responses={200:response,404:error})
    def post(self, request, format=None):
        if "mlmodel" not in self.request.data.keys():
            return Response({"detail":"mlmodel is required"}, status=status.HTTP_400_BAD_REQUEST)
        org = self.request.user.organization
        aws_settings = models.Setting.objects.filter(organization=org).get()
        result = tasks.upload_docs.delay(
                              self.request.data["mlmodel"],
                              aws_settings.aws_s3_log_base,
                              aws_settings.aws_s3_upload_base,
                              aws_settings.aws_region,
                              aws_settings.aws_key,
                              aws_settings.aws_secret
                              )
        return Response({"job_id":result.id},status.HTTP_200_OK)


class Train(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

    response = openapi.Response('model_info',
            openapi.Schema( type=openapi.TYPE_OBJECT,
                            properties={
                                    "job_id":openapi.Schema(type=openapi.TYPE_STRING),
                                    }))
    mlmodel = openapi.Parameter('mlmodel',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="model id",
                            type=openapi.TYPE_STRING,)
    script_directory = openapi.Parameter('script_directory',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="train script directory",
                            type=openapi.TYPE_STRING,)
    metric_name = openapi.Parameter('metric_name',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="f1, precision, recall, etc",
                            type=openapi.TYPE_STRING,)
    extra_kwargs = openapi.Parameter('extra_kwargs',
                            in_=openapi.IN_BODY,
                            required=True,
                            description="json of extra kwargs",
                            type=openapi.TYPE_OBJECT,)

    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))

    @swagger_auto_schema(operation_description="create training job", manual_parameters=[mlmodel], responses={200:response,404:error})
    def post(self, request, format=None):
        REQ_FIELD = ["mlmodel","metric_name","script_directory","extra_kwargs"]
        for field in REQ_FIELD:
            if field not in self.request.data.keys():
                return Response({"detail":field + " is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            json.loads(self.request.data["extra_kwargs"])
        except json.JSONDecodeError as e:
            return Response({"detail":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        org = self.request.user.organization
        aws_setings = None
        try:
            aws_settings = models.Setting.objects.filter(organization=org).get()
        except exceptions.ObjectDoesNotExist as e:
            return Response({"detail":"no aws settings configured"}, status=status.HTTP_400_BAD_REQUEST)
        result = tasks.train_model.delay(
                              model=self.request.data["mlmodel"],
                              organization=org.id,
                              metric=self.request.data["metric_name"],
                              s3_bucket_logs=aws_settings.aws_s3_log_base,
                              s3_bucket_temp_files=aws_settings.aws_s3_upload_base,
                              region=aws_settings.aws_region,
                              aws_access_key_id=aws_settings.aws_key,
                              aws_secret_access_key_id=aws_settings.aws_secret,
                              training_script_folder=self.request.data["script_directory"],
                              ec2_key_name=aws_settings.ec2_key_name,
                              extra_kwargs=self.request.data["extra_kwargs"]
                              )
        return Response({"job_id":result.id},status.HTTP_200_OK)



class HomePage(APIView):
    permission_classes = (permissions.IsAuthandReadOnlyIntegrator,)

    prediction__mlmodel = openapi.Parameter('prediction__mlmodel',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="prediction mlmodel",
                            type=openapi.TYPE_STRING)

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

    threshold = openapi.Parameter('thresh',
                            in_=openapi.IN_QUERY,
                            required=True,
                            description="end date",
                            type=openapi.TYPE_INTEGER)


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

    @swagger_auto_schema(manual_parameters=[source_id,start_date,end_date,threshold], responses={200:response,404:error})
    def get(self, request, format=None):
        # todo(aj) filter by model id
        # either pass in source ids list to filter by or double nested
        prediction__mlmodel = self.request.query_params.get("prediction__mlmodel","")
        max_df = int(self.request.query_params.get("max_df",80)) / 100.0
        min_df = int(self.request.query_params.get("min_df",0)) / 100.0
        source_id = self.request.query_params.get("source","")
        source__active = self.request.query_params.get("source__active",True)
        start_date = self.request.query_params.get("start_upload_date","")
        end_date = self.request.query_params.get("end_upload_date","")
        order_by = self.request.query_params.get("ordering","id")
        order_by = "id" if order_by == "" else order_by
        page = int(self.request.query_params.get("page", 1))
        page = 1 if page == "" else page
        match_id = self.request.query_params.getlist("match")
        threshold = int(self.request.query_params.get("threshold",0))
        if not isinstance(threshold,int) :
            return Response({"detail":"threshold must be and integer"}, status=status.HTTP_400_BAD_REQUEST)
        if threshold > 100 or threshold < 0 :
            return Response({"detail":"threshold must between 0 and 100"}, status=status.HTTP_400_BAD_REQUEST)
        threshold = threshold / 100.0
        filter_kwargs = {}
        filter_kwargs["organization"] = self.request.user.organization
        filter_kwargs["source__active"] = True
        if prediction__mlmodel != "":
            filter_kwargs["prediction__mlmodel"] = prediction__mlmodel
            filter_kwargs["prediction__mlmodel__active"] = True
            filter_kwargs["prediction__target"] = True
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
                                            "source__id",
                                             "title",
                                            "text",
                                             "id",
                                            )
        if len(sql_no_cummulate) == 0:
            response = {
            "count": 0,
            "results": [],
            "next": None,
            "previous": None,
            }
            return Response(response, status=status.HTTP_200_OK)
        vectorizer = vector.StemmedTfidfVectorizer( decode_error="ignore",
                                                    stemmer="english",
                                                   clean_html=True,
                                                   clean_hashes=True,
                                                    min_df=min_df,
                                                    max_df=max_df)
        all_results=[]
        if len(sql_no_cummulate) == 1:
             element = {"id":sql_no_cummulate[0]["id"],
                        "upload_date": sql_no_cummulate[0]["upload_date"],
                        "source__name":sql_no_cummulate[0]["source__name"],
                        "source": {"id":sql_no_cummulate[0]["source__id"],
                                   "name":sql_no_cummulate[0]["source__name"]},
                       "match":[],
                        "title": sql_no_cummulate[0]["title"]}
             all_results.append(element)

        if len(sql_no_cummulate) > 1:
            if threshold != 0:
                if len(sql_no_cummulate) > MAX_CLUSTER:
                    return Response({"detail":"Set MAX_DIFF to 0 or filter results; Max number of articles for clustering is " +
                                              str(MAX_CLUSTER)}, status=status.HTTP_400_BAD_REQUEST)
                tfidf = vectorizer.fit_transform([i["text"] for i in sql_no_cummulate])
                tfidf = tfidf.todense()
                Z = hierarchy.linkage(tfidf, "average", metric="cosine")
                C = hierarchy.fcluster(Z, threshold, criterion="distance")
                distinct_clusters = set(C)
                found_clusters = []
                all_results_cluster_indexes = {}
                for index, cluster_id in enumerate(C):
                    cluster_id = int(cluster_id)
                    if cluster_id not in found_clusters:
                        # use this for showing only level 1 down
                        element = {"id": sql_no_cummulate[index]["id"],
                                    "upload_date": sql_no_cummulate[index]["upload_date"],
                                    "source__name": sql_no_cummulate[index]["source__name"],
                                    "source": {"id": sql_no_cummulate[index]["source__id"],
                                               "name": sql_no_cummulate[index]["source__name"]},
                                   "match":[],
                                    "title": sql_no_cummulate[index]["title"]}
                        all_results.append(element)
                        found_clusters.append(cluster_id)
                        all_results_cluster_indexes[str(cluster_id)]=len(all_results)-1
                    else:
                        all_result_index = all_results_cluster_indexes[str(cluster_id)]
                        matched_id = sql_no_cummulate[index]["id"]
                        all_results[all_result_index]["match"].append(matched_id)
            else:
                for i,value in enumerate(sql_no_cummulate):
                     element = {"id": sql_no_cummulate[i]["id"],
                                "upload_date": sql_no_cummulate[i]["upload_date"],
                                "source__name": sql_no_cummulate[i]["source__name"],
                                "source": {"id": sql_no_cummulate[i]["source__id"],
                                           "name": sql_no_cummulate[i]["source__name"]},
                               "match":[],
                                "title": sql_no_cummulate[i]["title"]}
                     all_results.append(element)



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
            list_of_models = sorted(all_results, key=lambda x: x[order_by])
        else:
            list_of_models = sorted(all_results, key=lambda x: x[test_order_by],reverse=True)

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

        # replace match in serial.
        response = {
            "count": len(list_of_models),
            "results": sliced,
            "next": next_full_uri,
            "previous": prev_full_uri,

        }
        return Response(response, status=status.HTTP_200_OK)


class OrgViewSet(viewsets.ModelViewSet):
    def perform_create(self, serializer):
        serializer.save(organization = self.request.user.organization)


class SourceViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.SourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('id','name','active','url')
    filterset_class = SourceFilter

    def get_queryset(self):
        return models.Source.objects.filter(organization=self.request.user.organization)


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class PredictionFilter(filters.FilterSet):
    article_id = filters.NumberFilter(field_name="article_id")
    class Meta:
        model = models.Prediction
        fields = ("target", "mlmodel", "organization", "article_id")


class PredictionViewSet(OrgViewSet):
    permissions = (permissions.IsAuthandReadOnlyIntegrator,)
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    serializer_class = serializers.PredictionSerializer
    filterset_class = PredictionFilter

    def get_queryset(self):
        return models.Prediction.objects.filter(organization=self.request.user.organization)


class ClassificationFilter(filters.FilterSet):
    article_id_in = NumberInFilter(field_name="article_id", lookup_expr=("in"))
    article_id = filters.NumberFilter(field_name="article_id")

    class Meta:
        model = models.Classification
        fields = ('target', "mlmodel_id", "article_id", "article_id_in")


class ClassificationViewSet(OrgViewSet):
    permissions = (permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ClassificationSerializer
    filterset_class = ClassificationFilter

    def get_queryset(self):
        return models.Classification.objects.filter(organization=self.request.user.organization)


class SettingsViewSet(OrgViewSet):
    permissions = (permissions.IsAuthandReadOnlyStaff,)
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    serializer_class = serializers.SettingSerializer

    def get_queryset(self):
        return models.Setting.objects.filter(organization=self.request.user.organization)


class RssFilter(filters.FilterSet):
    class Meta:
        model = models.RSSSource
        fields = ('id','name','url','active')


class RssSourceViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.JobSourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = jobsourcecols
    filterset_class = JobSourceFilter

    def get_queryset(self):
        return models.JobSource.objects.filter(organization=self.request.user.organization)


class MLModelViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
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
    article_id_multi = filters.AllValuesMultipleFilter(field_name="id", lookup_expr=("exact"))
    #todo(aj) add combinedfilter https://rpkilby.github.io/django-filter/ref/groups.html

    ordering = filters.OrderingFilter(
        fields=[('source__name','source__name'),
                ('title','title'),
                ('upload_date','upload_date')]
    )

    class Meta:
        model = models.Article
        fields = ('id',
                  'source',
                  'title',
                  'upload_date',
                  'source__name',
                  'source__active',
                  "prediction__mlmodel",
                  "prediction__target",
                  "classification__mlmodel",
                  "classification__target",
                  )
        groups = [
                CombinedGroup(["prediction__mlmodel","prediction__target"]),
                CombinedGroup(["classification__mlmodel", "classification__target"])
        ]


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ArticleSerializer
    filter_backends = (filters.DjangoFilterBackend, rest_filters.OrderingFilter)
    filterset_class = ArticleFilter

    def get_queryset(self):
        return models.Article.objects.filter(organization=self.request.user.organization)


class RSSArticleFilter(filters.FilterSet):
    class Meta:
        model = models.RSSArticle
        fields = ARTICLE_SORT_FIELDS


class RSSArticleViewSet(viewsets.ModelViewSet):
    permissions = (permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions = (permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
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
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
    queryset = models.ArticleType.objects.all()
    serializer_class = serializers.ArticleTypeSerializer


class UserViewSet(viewsets.ModelViewSet):
    # userinfo on login
    permissions=(permissions.IsAuthandReadOnly,)
    serializer_class = serializers.UserSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "is_staff","is_integrator")

    def get_queryset(self):
        return models.UserIntStream.objects.filter(username=self.request.user.username).all()


class AllUserViewSet(viewsets.ModelViewSet):
    """
    All user view for super users
    """
    permissions=(permissions.IsAuthandSuperUser,)
    serializer_class = serializers.SuperUserSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id",
                        "username",
                        "first_name",
                        "last_name",
                        "email",
                        "is_staff",
                        "is_integrator",
                        "is_superuser",
                        "organization")

    def get_queryset(self):
        return models.UserIntStream.objects.all()


class OrgUserViewSet(viewsets.ModelViewSet):
    # org user view for staff members
    permissions=(permissions.IsAuthandReadOnlyStaff)
    serializer_class = serializers.SuperUserSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id",
                        "username",
                        "first_name",
                        "last_name",
                        "email",
                        "is_staff",
                        "is_integrator",
                        "is_superuser",
                        "organization")


    def get_queryset(self):
        return models.UserIntStream.objects.filter(organization=self.request.user.organization).all()


class OrganizationViewSet(viewsets.ModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyStaff,)
    serializer_class = serializers.OrganizationSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "name")

    def get_queryset(self):
        return models.Organization.objects.filter(id=self.request.user.organization.id).all()


class TaskResultViewSet(viewsets.ReadOnlyModelViewSet):
    permissions=(permissions.IsAuthandReadOnly,)
    serializer_class = serializers.TaskResult
    filterset_fields = ("id", )

    def get_queryset(self):
        return TaskResultMdl.objects.all()


class ModelVersionViewSet(viewsets.ModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyIntegrator,)
    serializer_class = serializers.ModelVersionSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id", "version","model__active", "model", "active")
    # todo(aj)
    # change from readonly
    # add upsert to serializer
    def get_queryset(self):
        return models.ModelVersion.objects.filter(model__organization=self.request.user.organization)


