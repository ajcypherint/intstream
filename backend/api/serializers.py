from rest_framework import serializers
from .models import (MLModel, JobSource,
                     TxtArticle,
                     Article, PDFArticle,
                    Source, ModelVersion,
                     UploadSource, RSSSource,
                     SourceType, ArticleType,
                     HtmlArticle, RSSArticle,
                     Setting, Prediction,
                     Classification, Organization)
from django_celery_results.models import TaskResult as TaskResultMdl
from utils import read
from django.conf import settings


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


class SourceSerializerNested(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    active = serializers.BooleanField(default=True)
    """class Meta:
        fields=[
            'id',
            'name',
            'active',
            'organization',

        ]
        model = Source
        extra_kwargs = {
            'name': {'validators': [MaxLengthValidator(100)]},
        }
        """

class MLModelOnlySerializer(serializers.ModelSerializer):
     class Meta:
        fields=[
            'id',
            'name',
            'created_date',
            'active',
            'train_lock',
            'script_directory',
            'organization',
        ]

        model = MLModel



class HomeSerializer(serializers.ModelSerializer):
    mlmodel = serializers.CharField()
    mlmodel_id = serializers.IntegerField()
    class Meta:
        fields=[
            'id',
            'name',
            'active',
            'organization',
            'mlmodel',
            "mlmodel_id"

        ]
        model = Source

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            'id',
            'name',
            'active',
            'organization',

        ]
        model = Source


class HomeFilterSerializer(serializers.BaseSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    active = serializers.BooleanField()
    mlmodel = serializers.CharField(max_length=1000,)



class MLModelSerializer(serializers.ModelSerializer):
    sources= SourceSerializerNested( many=True)
    class Meta:
        fields=[
            'id',
            'sources',
            'name',
            'created_date',
            'active',
            'train_lock',
            'script_directory',
            'organization',
        ]

        model = MLModel

    def create(self, validated_data):
        sources = validated_data["sources"]
        ids = [source["id"] for source in sources]
        ob = MLModel(
            name=validated_data["name"],
            script_directory=validated_data.get("script_directory",settings.DEFAULT_SCRIPT_MODEL),
            active=validated_data.get("active",False),
            organization=validated_data["organization"]
        )
        ob.save()
        ob.sources.set(ids, clear=True)
        ob.save()
        return ob

    def update(self, instance, validated_data):
        sources = validated_data.pop("sources")
        ids = [source["id"] for source in sources]
        instance.sources.set(ids, clear=True)
        instance.name = validated_data.get("name",instance.name)
        instance.active = validated_data.get("active",instance.active)
        instance.train_lock = validated_data.get("train_lock",instance.train_lock)
        instance.script_directory = validated_data.get("script_directory", instance.script_directory)
        instance.organization = validated_data.get("organization",instance.organization)
        instance.save()
        return instance


class ArticleSerializerSet(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    class Meta:
        fields= [
            'id',
           'source',
           'title',
           'upload_date',
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
           'encoding',
            'clean_text',

            'description',
            'link',
            'guid',
            'article_set',
            'organization',
        ]

        model = RSSArticle


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        fields=(
            "id",
            "aws_key",
            "aws_secret",
            "aws_s3_log_base",
            "aws_s3_upload_base",
            "aws_region"
        )
        model = Setting

    def create(self, validated_data):
        setting, created = Setting.objects.update_or_create(
            organization=validated_data.get("organization", None),
            defaults={
                "aws_key":validated_data.get("aws_key", None),
                "aws_secret":validated_data.get("aws_secret", None),
                "aws_s3_log_base":validated_data.get("aws_s3_log_base", None),
                "aws_s3_upload_base":validated_data.get("aws_s3_upload_base", None),
                "aws_region":validated_data.get("aws_region", None),
                "organization":validated_data.get("organization", None)

            }
        )
        return setting


class TaskResult(serializers.ModelSerializer):
    class Meta:
        fields=(
           "id",
            "content_encoding",
            "content_type",
            "date_done",
            "result",
            "status",
            "task_args",
            "task_id",
            "task_kwargs",
            "task_name",
            "traceback"
        )
        read_only_fields = (
           "id",
            "content_encoding",
            "content_type",
            "date_done",
            "result",
            "status",
            "task_args",
            "task_id",
            "task_kwargs",
            "task_name",
            "trace_back"
        )
        model = TaskResultMdl

class ArticleIDSerializer(serializers.ModelSerializer):
    class Meta:
        fields=("id",)
        model = Article

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        fields=(
            "id",
            "name"
        )
        model = Organization


class ClassificationSerializer(serializers.ModelSerializer):

    class Meta:
        fields=(
            "id",
            "target",
            "article_id",
            "mlmodel_id",
            "organization"
        )
        model = Classification

    def create(self, validated_data):
        classification, created = Classification.objects.update_or_create(
            article_id = validated_data.get("article_id", None),
            mlmodel_id= validated_data.get("mlmodel_id", None),
            organization = validated_data.get("organization", None),
            defaults={
                "target":validated_data.get("target", None)
            }
            )
        return classification



class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        fields=("article_id", "target", "mlmodel", "organization")
        model = Prediction


class ModelVersionSerializer(serializers.ModelSerializer):
    model = MLModelOnlySerializer(read_only=True)
    class Meta:
        fields = ("model",
                  "organization",
                  "version",
                 "celery_log",
                 "metric_name",
                  "status",
                  "task",
                  "status",
                  "file",
                  "active",
                  "metric_value")

        model = ModelVersion
