from rest_framework import serializers
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from django_celery_results.models import TaskResult as TaskResultMdl
from utils import read
from django.conf import settings
from api import tasks
from api import models


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        fields=(
            "id",
            "name",
            "freemium"
        )
        model = models.Organization


class SourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
            "id",
            "name",
            "api_endpoint"
        ]
        model = models.SourceType


class ArticleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields=[
           "id",
           "name",
           "api_endpoint"
        ]
        model = models.ArticleType


class UserSerializerUpdate(serializers.ModelSerializer):
    """
    used to set password
    """
    class Meta:
        model = models.UserIntStream
        fields = ('username', 'password')

        write_only_fields=["password"]

    def create(self,*args,**kwargs):
        user = super().create(*args,**kwargs)
        p = user.password
        user.set_password(p)
        user.save()
        return user

    def update(self, *args,**kwargs):
        user = super().update(*args,**kwargs)
        p = user.password
        user.set_password(p)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    used to get user information;
    create a user
    """
    class Meta:
        fields = [
            "id",
            "organization",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "is_integrator",
            "is_staff",
            "is_superuser"
        ]
        read_only_fields = [
            "id",
            "is_superuser"
        ]
        write_only_fields = ["password"]

        model = models.UserIntStream

    def create(self,*args,**kwargs):
        user = super().create(*args,**kwargs)
        p = user.password
        user.set_password(p)
        user.save()
        return user

    def update(self, *args,**kwargs):
        user = super().update(*args,**kwargs)
        p = user.password
        user.set_password(p)
        user.save()
        return user


class JobSerializer(serializers.ModelSerializer):

    class Meta:

        fields = [
            "id",
            'name',
            'active',
            'last_run',
            'last_status',
            'arguments',
            'organization',
            'cron_day_of_week',
            'cron_day_of_month',
            'cron_month_of_year',
            'cron_hour',
            'cron_minute',
            'user',

        ]
        model = models.Job

    def _create_schedule(self, job_id, *args, **kwargs):
        schedule, created = CrontabSchedule.objects.get_or_create(
             day_of_week=kwargs.get("crontab_day_of_week", None),
             day_of_month=kwargs.get("crontab_day_of_month", None),
             month_of_year=kwargs.get("month_of_year", None),
             hour=kwargs.get("crontab_hour", None),
             minute=kwargs.get("crontab_minute", None))

        task, _ = PeriodicTask.objects.get_or_create(
            interval=schedule,
            name = kwargs.get("name", None),
            task='api.tasks.job',
            args={"id":job_id}
        )

    def create(self,*args,**kwargs):
        job = super().create(*args,**kwargs)
        self._create_schedule(job.id, *args, **kwargs)
        return job

    def update(self, *args,**kwargs):
        job = super().update(*args,**kwargs)
        self._create_schedule(*args, **kwargs)
        return job


class JobVersionSerlializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.Job.objects.all())
    class Meta:
        fields = [
            "id",
            "job",
            "organization",
            "zip",
            "version"
        ]
        model = models.JobVersion


class IndicatorJobSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name",
            "active",
            "organization",
            "indicator_types",
            "python_version",
            "last_run",
            "last_status",
            "arguments",
            "user",
            "timeout",
        ]
        model = models.IndicatorJob


class IndicatorType(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name"
        ]

        model = models.IndicatorType


class IndicatorJobVersionSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.IndicatorJob.objects.all())
    class Meta:
        fields = [
            "id",
            "job",
            "organization",
            "zip",
            "version"
        ]
        model = models.IndicatorJobVersion


class UploadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            'name',
            'active',
            'organization',

        ]
        model = models.UploadSource


class RssSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            'name',
            'active',
            'url',
            'organization',
            'extract_indicators',

        ]
        model = models.RSSSource


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

        model = models.MLModel


class HomeSerializer(serializers.ModelSerializer):
    mlmodel = serializers.CharField()
    mlmodel_id = serializers.IntegerField()

    class Meta:
        fields = [
            'id',
            'name',
            'active',
            'organization',
            'mlmodel',
            "mlmodel_id"

        ]
        model = models.Source


class SourceSerializer(serializers.ModelSerializer):

    class Meta:
        fields=[
            'id',
            'name',
            'active',
            'organization',

        ]
        model = models.Source


class ClassifFilterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100,read_only=True)
    active = serializers.BooleanField(read_only=True)
    mlmodel = serializers.CharField(max_length=1000,read_only=True)
    mlmodel_id = serializers.IntegerField(read_only=True)
    mlmodel_active = serializers.BooleanField(read_only=True)
    target = serializers.BooleanField(read_only=True)

    def to_representation(self, instance):
        return {
            "id": instance["id"],
            "name": instance["name"],
            "active": instance["active"],
            "mlmodel": instance["mlmodel"],
            "mlmodel_id": instance["mlmodel_id"],
            "mlmodel_active": instance["mlmodel_active"],
            "target": instance["target"]

        }


class HomeFilterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100,read_only=True)
    active = serializers.BooleanField(read_only=True)
    mlmodel = serializers.CharField(max_length=1000,read_only=True)
    mlmodel_id = serializers.IntegerField(read_only=True)
    mlmodel_active = serializers.BooleanField(read_only=True)
    target = serializers.BooleanField(read_only=True)

    def to_representation(self, instance):
        return {
            "id": instance["id"],
            "name": instance["name"],
            "active": instance["active"],
            "mlmodel": instance["mlmodel"],
            "mlmodel_id": instance["mlmodel_id"],
            "mlmodel_active": instance["mlmodel_active"],
            "target": instance["target"]

        }


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

        model = models.MLModel

    def create(self, validated_data):
        sources = validated_data["sources"]
        ids = [source["id"] for source in sources]
        ob = models.MLModel(
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


class ClassificationSerializer(serializers.ModelSerializer):
    article_id = serializers.IntegerField()
    mlmodel_id = serializers.IntegerField()

    class Meta:
        fields=(
            "id",
            "target",
            "article_id",
            "mlmodel_id",
            "organization",
        )
        model = models.Classification

    def create(self, validated_data):
        # lookup with given kwargs, update with defaults if exists
        # created is boolean on whether or not one was created
        classification, created = models.Classification.objects.update_or_create(
            article_id = validated_data.get("article_id", None),
            mlmodel_id = validated_data.get("mlmodel_id", None),
            organization = validated_data.get("organization", None),
            defaults={
                "target":validated_data.get("target", None)
            }
            )
        return classification


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

        model = models.Article


class DefaultArticleSerializer(serializers.ModelSerializer):
    clean_text = serializers.SerializerMethodField()

    def get_clean_text(self, obj):
        reader = read.HTMLRead(obj.text)
        return reader.read()


class ArticleSerializer(DefaultArticleSerializer):
    source = SourceSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    classification_set = ClassificationSerializer(read_only=True, many=True)
    article_set = ArticleSerializerSet(many=True, read_only=True)

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
           'classification_set',
        ]
        model = models.Article


class PDFSerializer(DefaultArticleSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=models.Source.objects.all())
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        fields= [
           'id',
           'source',
           'title',
           'upload_date',
           'file',
           'encoding',
           'password',
           'organization',
        ]

        model = models.PDFArticle


class RawSerializer(DefaultArticleSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=models.Source.objects.all())
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        fields= [
           'id',
           'source',
           'title',
           'upload_date',
           'text',
           'clean_text',
           'organization',
        ]
        model = models.RawArticle


class HtmlSerializer(DefaultArticleSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=models.Source.objects.all())
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        fields= [
           'id',
           'source',
           'title',
           'upload_date',
           'file',
           'encoding',
           'clean_text',
           'organization',
        ]
        model = models.HtmlArticle


class WordDocxSerializer(DefaultArticleSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=models.Source.objects.all())
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        fields= [
           'id',
           'source',
           'title',
           'upload_date',
           'file',
           'encoding',
           'organization',
        ]
        model = models.TxtArticle


class TxtSerializer(DefaultArticleSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=models.Source.objects.all())
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        fields= [
           'id',
           'source',
           'title',
           'upload_date',
           'file',
           'encoding',
           'organization',
        ]
        model = models.TxtArticle


class RSSSerializer(DefaultArticleSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=models.Source.objects.all())
    organization = OrganizationSerializer(read_only=True)

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
            'organization'
        ]

        model = models.RSSArticle


class TrainingScriptSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    class Meta:
        fields = (
            "id",
            "name",
            "organization"
        )
        model = models.TrainingScript


class TrainingScriptVersionSerializer(serializers.ModelSerializer):
    class Meta:
        fields=(
            "id",
            "version",
            "script",
            "zip"
        )
        model = models.TrainingScriptVersion


class SettingSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    class Meta:
        fields=(
            "id",
            "organization",
            "aws_key",
            "aws_secret",
            "aws_s3_log_base",
            "aws_s3_upload_base",
            "aws_region"
        )
        extra_kwargs = {'aws_secret': {'write_only': True}}
        model = models.Setting


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
        model = models.Article


class PredictionSerializer(serializers.ModelSerializer):

    class Meta:
        fields=("article_id",
                "target",
                "mlmodel",
                "organization",
                )
        model = models.Prediction


class ModelVersionSerializer(serializers.ModelSerializer):
    model = MLModelOnlySerializer(read_only=True)

    class Meta:
        fields = (
                 "id",
                 "model",
                  "organization",
                  "version",
                  "celery_log",
                  "metric_name",
                  "status",
                  "task",
                  "file",
                  "extra_kwargs",
                  "active",
                  "metric_value")

        model = models.ModelVersion


class IndicatorMD5Serializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "value"
        ]
        model = models.IndicatorMD5


class IndicatorSha256Serializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "value",
        ]
        model = models.IndicatorSha256


class IndicatorEmailSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "value",
        ]
        model = models.IndicatorEmail


class IndicatorSha1Serializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "value"
        ]
        model = models.IndicatorSha1


class IndicatorNetLocSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    registered = serializers.SerializerMethodField()

    def get_url(self, obj):
        subdomain = obj.subdomain + "." if obj.subdomain != "" else ""
        return "http://" + subdomain + obj.domain + "." + obj.suffix.value

    def get_registered(self, obj):
        return obj.domain + "." + obj.suffix.value

    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "subdomain",
            "domain",
            "suffix",
            "url",
            "registered"
        ]
        model = models.IndicatorNetLoc


class SuffixSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "value"
        ]
        model = models.Suffix


class IndicatorIPV6Serializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "value"
        ]
        model = models.IndicatorIPV6


class IndicatorIPV4Serializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "organization",
            "value"
        ]
        model = models.IndicatorIPV4


class IndicatorNumericField(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "value",
            "name",
            "organization",
            "indicator",
        ]
        model = models.IndicatorNumericField


class IndicatorTextField(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "value",
            "name",
            "organization",
            "indicator",
        ]
        model = models.IndicatorTextField

