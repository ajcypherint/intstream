from rest_framework import serializers
from .models import (MLModel, JobSource,
                     TxtArticle, Categories,
                     Article, PDFArticle,
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


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
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
           'name',
           'created_date',
           'model',
           'enabled'
        ]

        model = Categories



class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        fields= [
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'encoding',
           'text',
        ]
        model = Article

class PDFSerializer(serializers.ModelSerializer):
    class Meta:
        fields= [
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',
           'text',

            'password'
        ]

        model = PDFArticle


class HtmlSerializer(serializers.ModelSerializer):
    class Meta:
        fields= [
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',
           'text',
        ]
        model = HtmlArticle


class WordDocxSerializer(serializers.ModelSerializer):
    class Meta:
        fields= [
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',
           'text',
        ]
        model = TxtArticle


class TxtSerializer(serializers.ModelSerializer):
    class Meta:
        fields= [
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',
           'text',
        ]
        model = TxtArticle

class RSSSerializer(serializers.ModelSerializer):
    class Meta:
        fields= [
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'encoding',
           'text',

            'description',
            'link',
            'guid',
        ]
        model = RSSArticle

