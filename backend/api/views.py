from django.shortcuts import render
from . import serializers
from . import models

from rest_framework import viewsets
# Create your views here.


class DocTypeViewSet(viewsets.ModelViewSet):
    queryset = models.DocType.objects.all()
    serializer_class = serializers.DocTypeSerializer


class MLModelViewSet(viewsets.ModelViewSet):
    queryset = models.MLModel.objects.all()
    serializer_class = serializers.MLModelSerializer


class RssSourceViewSet(viewsets.ModelViewSet):
    queryset = models.RssSource.objects.all()
    serializer_class = serializers.RssSourceSerializer


class DocumentSourceViewSet(viewsets.ModelViewSet):
    queryset = models.DocumentSource.objects.all()
    serializer_class = serializers.DocumentSourceSerializer


class CategoriesViewSet(viewsets.ModelViewSet):
    queryset = models.Categories.objects.all()
    serializer_class = serializers.CategoriesSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = models.Categories.objects.all()
    serializer_class = serializers.ArticleSerializer
