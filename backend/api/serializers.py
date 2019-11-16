from rest_framework import serializers
from .models import (MLModel, JobSource,
                     TxtArticle,
                     Article, PDFArticle,
                    Source,
                     UploadSource, RSSSource,
                     SourceType, ArticleType,
                     HtmlArticle, RSSArticle)

from utils import read



class SourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            "name",
            "api_endpoint"
        ]
        model = SourceType


class ArticleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           "id",
           "name",
           "api_endpoint"
        ]
        model = ArticleType

#class UserSerializer(serializers.ModelSerializer):
#    class Meta:
#        fields=[
#            "password",
#            "is_staff",
#            "is_admin"
#        ]

class JobSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            'name',
            'active',
            'script_path',
            'working_dir',
            'virtual_env_path',
            'python_binary_fullpath',
            'last_run',
            'last_status',
            'arguments',
            'organization'

        ]
        model = JobSource

class UploadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            'name',
            'active',
            'organization',

        ]
        model = UploadSource


class RssSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            'name',
            'active',
            'url',
            'organization',

        ]
        model = RSSSource

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'id',
            'name',
            'active',
            'organization',

        ]
        model = Source

class HomeFilter(serializers.BaseSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    active = serializers.BooleanField()

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'id',
            'sources',
            'name',
            'created_date',
            'base64_encoded_model',
            'enabled',
            'organization',
        ]

        model = MLModel



class ArticleSerializerSet(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'encoding',
           'organization',
        ]

        model = Article

class ArticleSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializerSet(many=True, read_only=True)
    clean_text = serializers.SerializerMethodField()

    def get_clean_text(self, obj):
        reader = read.HTMLRead(obj.text)
        return reader.read()

    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'encoding',
            'clean_text',
            'article_set',
            'organization',
        ]
        model = Article

class PDFSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializer(many=True, read_only=True)
    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'file',
           'encoding',
            'password',
            'article_set',
            'organization',
        ]

        model = PDFArticle


class HtmlSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializer(many=True, read_only=True)
    clean_text = serializers.SerializerMethodField()

    def get_clean_text(self, obj):
        reader = read.HTMLRead(obj.text)
        return reader.read()

    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'file',
           'encoding',
            'clean_text',
            'article_set',
            'organization',
        ]
        model = HtmlArticle


class WordDocxSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializer(many=True, read_only=True)
    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'file',
           'encoding',
            'article_set',
            'organization',
        ]
        model = TxtArticle


class TxtSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializer(many=True, read_only=True)
    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'file',
           'encoding',
            'article_set',
            'organization',
        ]
        model = TxtArticle

class RSSSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializer(many=True, read_only=True)
    clean_text = serializers.SerializerMethodField()

    def get_clean_text(self, obj):
        reader = read.HTMLRead(obj.text)
        return reader.read()

    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'encoding',
            'clean_text',

            'description',
            'link',
            'guid',
            'article_set',
            'organization',
        ]

        model = RSSArticle


