from rest_framework import serializers
from .models import RssSource,DocType,DocumentSource,MLModel,Article,Categories

class RssSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            'name',
            'active',
            'upload_date',
            'mlmodels',
            'url'

        ]
    model = RssSource


class DocTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           "id",
           "name",
           "extension"
        ]
    model = DocType

class DocumentSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
             "id",
            'name',
            'active',
            'upload_date',
            'mlmodels',
            'document_type'

        ]
    model = DocumentSource


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'sources',
            'name',
            'created_date',
            'base64_encoded_model' 
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
           'parent_match',
           'categories'
        ]

    model = Article
