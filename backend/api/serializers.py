from rest_framework import serializers
from .models import (MLModel, TxtArticle, Categories, Article, PDFArticle,
                     UploadSource, RSSSource, SourceType, ArticleType, HtmlArticle)

class SourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "name",
            "api_endpoint"
        ]
        model = SourceType

class ArticleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
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
            'python_binary_full_path',
            'last_run',
            'last_status',
            'arguments'

        ]
        model = UploadSource

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
        fields=[
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',

        ]
        model = Article

class PDFSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',
           'password'

        ]

        model = PDFArticle

class HtmlSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',

        ]

        model = HtmlArticle

class WordDocxSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',

        ]

        model = TxtArticle


class TxtSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           'source',
           'title',
           'upload_date',
            'match_articles',
           'categories',
           'file',
           'encoding',

        ]

        model = TxtArticle
