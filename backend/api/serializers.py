from rest_framework import serializers
from .models import MLModel,TxtArticle,Categories,UploadSource,RSSSource,SourceType

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "password",
            "is_staff",
            "is_admin"
        ]

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

class TxtSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           'source',
           'title',
           'upload_date',
           'parent_match',
           'categories',
           'file',
           'encoding',

        ]

        model = TxtArticle
