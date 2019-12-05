from django.shortcuts import render
import coreapi, coreschema
from random import randint
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
from django.db.models import F
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
                            in_=openapi.IN_BODY,
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
    error = openapi.Response("error",
                             openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                 properties={
                                     "error":openapi.Schema(type=openapi.TYPE_STRING)
                                 }

                             ))
    @swagger_auto_schema(manual_parameters=[model], responses={200:response,404:error})
    def get(self, request, format=None):
        # todo(aj) filter by model id
        # either pass in source ids list to filter by or double nested
        model_id = self.request.query_params["model"]
        count = models.Article.objects.filter(organization=self.request.user.organization,
                                             categories=None,
                                              source__mlmodel=int(model_id)).count()
        if count == 0:
            return Response({"error":"no articles found for model " + str(model_id)},status.HTTP_404_NOT_FOUND)
        random_index = randint(0, count - 1)
        object = models.Article.objects.filter(organization=self.request.user.organization,
                                             categories=None,
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
    ordering = filters.OrderingFilter(
        fields=[('source__name','source_name'),
                ('title','title'),
                ('upload_date','upload_date')]
    )
    class Meta:
        model = models.Article
        fields = ('id','source','title','upload_date', 'source__name','source__mlmodel__id')


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
        fields = ("id","mlmodel","target","article")

class ClassificationViewSet(OrgViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator,)
    serializer_class = serializers.ClassificationSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ("id","mlmodel","target","article")
    filterset_class = ClassificationFilter

    def get_queryset(self):
        return models.Classification.objects.filter(organization=self.request.user.organization)
