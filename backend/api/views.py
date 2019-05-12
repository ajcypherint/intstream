from django.shortcuts import render
from . import serializers
from . import models
from rest_framework import filters as rest_filters
from django_filters import rest_framework as filters
import importlib
from  utils.document import TXT
from . import permissions

from rest_framework import viewsets
# Create your views here.

class UploadSourceViewSet(viewsets.ModelViewSet):
    queryset = models.UploadSource.objects.all()
    serializer_class = serializers.UploadSourceSerializer


class RssSourceViewSet(viewsets.ModelViewSet):
    queryset = models.RSSSource.objects.all()
    serializer_class = serializers.RssSourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filter_fields = ('name','active','url')


class MLModelFilter(filters.FilterSet):
    class Meta:
        model = models.MLModel
        fields = ('name','created_date','enabled')


class MLModelViewSet(viewsets.ModelViewSet):
    queryset = models.MLModel.objects.all()
    serializer_class = serializers.MLModelSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('name','created_date','enabled')
    filterset_class = MLModelFilter


class RssFilter(filters.FilterSet):
    class Meta:
        model = models.RSSSource
        fields = ('name','url')


class RssSourceViewSet(viewsets.ModelViewSet):
    queryset = models.RSSSource.objects.all()
    serializer_class = serializers.RssSourceSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('name','active','url','upload_date')
    filterset_class = RssFilter

    def perform_create(self, serializer):
        #todo(aj) read rss to text field
        # text = rss.read
        # serializer.save(text=text)
        pass


class CategoriesFilter(filters.FilterSet):
    class Meta:
        model = models.Categories
        fields = ('name','created_date','enabled')


class CategoriesViewSet(viewsets.ModelViewSet):
    queryset = models.Categories.objects.all()
    serializer_class = serializers.CategoriesSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('name','created_date','enabled')
    filterset_class = CategoriesFilter


class TxtArticleFilter(filters.FilterSet):
    class Meta:
        model = models.TxtArticle
        fields = ('source','title','upload_date')


class TxtArticleViewSet(viewsets.ModelViewSet):
    permissions=(permissions.IsAuthandReadOnlyOrAdminOrIntegrator)
    queryset = models.TxtArticle.objects.all()
    serializer_class = serializers.TxtSerializer
    filter_backends = (filters.DjangoFilterBackend,rest_filters.OrderingFilter,rest_filters.SearchFilter)
    filterset_fields = ('source','title','upload_date')
    filterset_class = TxtArticleFilter

    def perform_create(self, serializer):
        instance = TXT(self.request.FILES['file'],self.request.data.encoding)
        text = instance.read()
        serializer.save(text=text)

    def process_html(self):
        pass

    def process_PDF(self):
        pass
