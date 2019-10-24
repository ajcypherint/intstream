from rest_framework import serializers
from .models import (MLModel, JobSource,
                     TxtArticle, Categories,
                     Article, PDFArticle,
                    Source,
                     UploadSource, RSSSource,
                     SourceType, ArticleType,
                     HtmlArticle, RSSArticle)

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
            'arguments'

        ]
        model = JobSource

class UploadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            'name',
            'active',

        ]
        model = UploadSource


class RssSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            'name',
            'active',
            'url'

        ]
        model = RSSSource


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'id',
            'name',
            'active',
        ]
        model = Source


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'id',
            'sources',
            'name',
            'created_date',
            'base64_encoded_model',
            'enabled'
        ]

        model = MLModel

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'id',
           'name',
           'created_date',
           'model',
           'enabled'
        ]

        model = Categories


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
           'text',
        ]
        model = Article

class ArticleSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    article_set = ArticleSerializerSet(many=True, read_only=True)
    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
            'parent',
           'categories',
           'encoding',
           'text',
            'article_set'
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
           'text',
            'password'
            'article_set'
        ]

        model = PDFArticle


class HtmlSerializer(serializers.ModelSerializer):
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
           'text',
            'article_set'
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
           'text',
            'article_set'
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
           'text',
            'article_set'
        ]
        model = TxtArticle

class RSSSerializer(serializers.ModelSerializer):
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
           'encoding',
           'text',

            'description',
            'link',
            'guid',
            'article_set'
        ]

        model = RSSArticle

