from rest_framework import serializers
from django_celery_beat import models as beat_models
from django_celery_results.models import TaskResult as TaskResultMdl
from utils import read
from django.conf import settings
from api import tasks
from api import models
import json
from django.utils import timezone


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
        fields = ('username', "password")
        extra_kwargs = {"password": {"write_only": True}}

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
            "is_integrator",
            "is_staff",
            "is_superuser",
            "password",
        ]
        read_only_fields = [
            "id",
            "is_superuser"
        ]
        extra_kwargs = {"password": {"write_only": True}}

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
            'timeout',
            'server_url',

        ]
        model = models.Job

    def _create_schedule(self, job_id, kwargs):
        schedule, created = beat_models.CrontabSchedule.objects.get_or_create(
             day_of_week=kwargs.get("cron_day_of_week", None),
             day_of_month=kwargs.get("cron_day_of_month", None),
             month_of_year=kwargs.get("cron_month_of_year", None),
             hour=kwargs.get("cron_hour", None),
             minute=kwargs.get("cron_minute", None))

        org = kwargs.get("organization", None)
        task, _ = models.OrgPeriodicTask.objects.get_or_create(
            crontab=schedule,
            name = kwargs.get("name", None),
            task='api.tasks.job',
            organization=org,
            start_time=timezone.now(),
            enabled=kwargs.get("active", False),
            kwargs=json.dumps({"active":kwargs.get("active", False), "id": job_id, "organization_id":org.pk})
        )
        #todo add enabled; add enabled to gui

    def _update_schedule(self, job, kwargs):
        schedule, created = beat_models.CrontabSchedule.objects.get_or_create(
             day_of_week=kwargs.get("cron_day_of_week", None),
             day_of_month=kwargs.get("cron_day_of_month", None),
             month_of_year=kwargs.get("cron_month_of_year", None),
             hour=kwargs.get("cron_hour", None),
             minute=kwargs.get("cron_minute", None))
        periodic_task = models.OrgPeriodicTask.objects.get(name=job.name)
        kwargs_task = json.loads(periodic_task.kwargs)
        kwargs_task["active"] = kwargs.get("active", False)
        periodic_task.kwargs = json.dumps(kwargs_task)
        periodic_task.enabled = kwargs.get("active", False)
        periodic_task.crontab = schedule
        periodic_task.save()

    def create(self,validated_data):
        job = super().create(validated_data)
        self._create_schedule(job.id, validated_data)
        return job

    def update(self, instance, validated_data):
        job = super().update(instance, validated_data)
        self._update_schedule(instance, validated_data)
        return job


class JobSerializerNested(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.IntegerField()


class JobVersionSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.Job.objects.all())
    class Meta:
        fields = [
            "id",
            "job",
            "organization",
            "zip",
            "version",
            "active"
        ]
        model = models.JobVersion


class StandardIndicatorJobSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name",
            "active",
            "organization",
            "indicator_types",
            "last_run",
            "last_status",
            "arguments",
            "user",
            "timeout",
            'server_url',
        ]
        model = models.StandardIndicatorJob


class UnmitigateIndicatorJobSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name",
            "active",
            "organization",
            "indicator_type",
            "last_run",
            "last_status",
            "arguments",
            "user",
            "timeout",
            'server_url',
        ]
        model = models.UnmitigateIndicatorJob


class MitigateIndicatorJobSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name",
            "active",
            "organization",
            "indicator_type",
            "last_run",
            "last_status",
            "arguments",
            "auto_mitigate",
            "manual_mitigate",
            "user",
            "timeout",
            'server_url',
        ]
        model = models.MitigateIndicatorJob


class JobLogSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.Job.objects.all())
    class Meta:
        fields = [
            "date",
            "stderr",
            "stdout",
            "organization",
            "job",
            "task_id",
            "id",
        ]
        model = models.JobLog


class IndicatorJobLogSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.BaseIndicatorJob.objects.all())
    class Meta:
        fields = [
            "date",
            "stderr",
            "stdout",
            "organization",
            "job",
            "task_id",
            "id",

        ]
        model = models.IndicatorJobLog

class IndicatorType(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name"
        ]

        model = models.IndicatorType


class StandardIndicatorJobVersionSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.StandardIndicatorJob.objects.all())
    class Meta:
        fields = [
            "id",
            "job",
            "organization",
            "zip",
            "version",
            "active",
        ]
        model = models.StandardIndicatorJobVersion


class MitigateIndicatorJobVersionSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.MitigateIndicatorJob.objects.all())
    class Meta:
        fields = [
            "id",
            "job",
            "organization",
            "zip",
            "version",
            "active",
        ]
        model = models.MitigateIndicatorJobVersion


class UnmitigateIndicatorJobVersionSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=models.UnmitigateIndicatorJob.objects.all())
    class Meta:
        fields = [
            "id",
            "job",
            "organization",
            "zip",
            "version",
            "active",
        ]
        model = models.UnmitigateIndicatorJobVersion


class UploadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            'name',
            'active',
            'organization',
            'extract_indicators'

        ]
        model = models.UploadSource


class FileUploadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            'name',
            'active',
            'organization',
            'extract_indicators',
            'type'

        ]
        model = models.FileUploadSource


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
    source__id = serializers.IntegerField(read_only=True)
    source__name = serializers.CharField(max_length=100,read_only=True)
    source__active = serializers.BooleanField(read_only=True)
    prediction__mlmodel__name = serializers.CharField(max_length=1000,read_only=True)
    prediction__mlmodel__id = serializers.IntegerField(read_only=True)
    prediction__mlmodel__active = serializers.BooleanField(read_only=True)
    prediction__target = serializers.BooleanField(read_only=True)
    upload_dt = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            "upload_dt":    instance["upload_dt"],
            "source__id":     instance["source__id"],
            "source__name":   instance["source__name"],
            "source__active": instance["source__active"],
            "prediction__mlmodel__name":   instance["prediction__mlmodel__name"],
            "prediction__mlmodel__id":     instance["prediction__mlmodel__id"],
            "prediction__mlmodel__active": instance["prediction__mlmodel__active"],
            "prediction__target":          instance["prediction__target"]

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
    indicator_set = serializers.PrimaryKeyRelatedField(queryset=models.Indicator.objects.all(), many=True,)
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
           "indicator_set"
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
           'clean_text',
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
           'clean_text',
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
            "active",
            "organization"
        )
        model = models.TrainingScript


class TrainingScriptVersionSerializer(serializers.ModelSerializer):
    script = serializers.PrimaryKeyRelatedField(queryset=models.TrainingScript.objects.all())
    class Meta:
        fields=(
            "id",
            "version",
            "active",
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
           "task_id",
           "task_name",
           "task_args",
           "task_kwargs",
           "status",
           "worker",
           "content_type",
           "content_encoding",
           "result",
           "date_created",
           "date_done",
           "traceback",
           "meta"
        )
        read_only_fields = (
           "task_id",
           "task_name",
           "task_args",
           "task_kwargs",
           "status",
           "worker",
           "content_type",
           "content_encoding",
           "result",
           "date_created",
           "date_done",
           "traceback",
           "meta"
        )
        model = models.OrgTaskResultMdl


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


class IndicatorSerializer(serializers.ModelSerializer):

    ind_type = serializers.PrimaryKeyRelatedField(queryset=models.IndicatorType.objects.all())

    class Meta:
        fields = [
            "id",
            "ind_type",
            "articles",
            "organization",
            "upload_date",
            "reviewed",
            "allowed",
            "mitigated"
        ]
        read_only_fields = [
            "ind_type",
            "id",
            "upload_date"
        ]
        model = models.Indicator


class IndicatorMD5Serializer(serializers.ModelSerializer):

    class Meta:
        fields = [
            "id",
            "articles",
            "ind_type",
            "organization",
            "upload_date",
            "value",
            "reviewed",
            "allowed",
            "mitigated"

        ]
        model = models.IndicatorMD5


class IndicatorSha256Serializer(serializers.ModelSerializer):

    class Meta:
        fields = [
            "id",
            "articles",
            "ind_type",
            "organization",
            "upload_date",
            "value",
            "reviewed",
            "allowed",
            "mitigated"

        ]
        model = models.IndicatorSha256


class IndicatorEmailSerializer(serializers.ModelSerializer):

    class Meta:
        fields = [
            "id",
            "articles",
            "ind_type",
            "organization",
            "upload_date",
            "value",
            "reviewed",
            "allowed",
            "mitigated"

        ]
        model = models.IndicatorEmail


class IndicatorSha1Serializer(serializers.ModelSerializer):

    class Meta:
        fields = [
            "id",
            "articles",
            "ind_type",
            "organization",
            "upload_date",
            "value",
            "reviewed",
            "allowed",
            "mitigated"

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
            "ind_type",
            "organization",
            "subdomain",
            "domain",
            "suffix",
            "value",
            "url",
            "upload_date",
            "registered"
        ]
        read_only_fields = [
            "value",
            "id"
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
            "ind_type",
            "organization",
            "upload_date",
            "value",
            "reviewed",
            "allowed",
            "mitigated"

        ]
        model = models.IndicatorIPV6


class IndicatorIPV4Serializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "articles",
            "ind_type",
            "organization",
            "upload_date",
            "value",
            "reviewed",
            "allowed",
            "mitigated"

        ]
        model = models.IndicatorIPV4


class IndicatorNumericField(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name",
            "value",
            "organization",
            "update_date",
            "indicator",
        ]
        model = models.IndicatorNumericField


class IndicatorTextFieldName(serializers.ModelSerializer):
    class Meta:
        fields = [
            "name",
            "organization",
        ]
        model = models.IndicatorTextField


class IndicatorNumericFieldName(serializers.ModelSerializer):
    class Meta:
        fields = [
            "name",
            "organization",
        ]
        model = models.IndicatorNumericField


class IndicatorTextField(serializers.ModelSerializer):
    class Meta:
        fields = [
            "id",
            "name",
            "value",
            "organization",
            "update_date",
            "indicator",
        ]
        model = models.IndicatorTextField

