from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel
from django.contrib.auth.models import AbstractUser
from django.db.models.constraints import UniqueConstraint, CheckConstraint
from django.db.models import Q, F,Value
from semantic_version.django_fields import VersionField
from django.core import validators
from django_celery_results.models import TaskResult as TaskResultMdl
from django_celery_beat.models import PeriodicTask
from django_celery_results import backends, managers

import uuid
import os
from fernet_fields import EncryptedTextField
from django.conf import settings
from django.db.models.functions import Concat

# all queries filter by org
# Admin can see all orgs; add new orgs
# integrator can only see their own org; cannot add orgs
# Not integrator and not admin can only see their own org; cannot add orgs


class Organization(models.Model):
    name = models.CharField(max_length=200, unique=True)
    freemium = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class OrgTaskResultManager(managers.TaskResultManager):

    @managers.transaction_retry(max_retries=2)
    def store_result_org(self, content_type, content_encoding,
                     task_id, result, status,
                     traceback=None, meta=None,
                     task_name=None, task_args=None, task_kwargs=None,
                     worker=None, using=None, organization_id=None):
        """Store the result and status of a task.

        Arguments:
        ---------
            content_type (str): Mime-type of result and meta content.
            content_encoding (str): Type of encoding (e.g. binary/utf-8).
            task_id (str): Id of task.
            task_name (str): Celery task name.
            task_args (str): Task arguments.
            task_kwargs (str): Task kwargs.
            result (str): The serialized return value of the task,
                or an exception instance raised by the task.
            status (str): Task status.  See :mod:`celery.states` for a list of
                possible status values.
            worker (str): Worker that executes the task.
            using (str): Django database connection to use.

        Keyword Arguments:
        -----------------
            traceback (str): The traceback string taken at the point of
                exception (only passed if the task failed).
            meta (str): Serialized result meta data (this contains e.g.
                children).
            exception_retry_count (int): How many times to retry by
                transaction rollback on exception.  This could
                happen in a race condition if another worker is trying to
                create the same task.  The default is to retry twice.

        """
        fields = {
            'status': status,
            'result': result,
            'traceback': traceback,
            'meta': meta,
            'content_encoding': content_encoding,
            'content_type': content_type,
            'task_name': task_name,
            'task_args': task_args,
            'task_kwargs': task_kwargs,
            'organization_id': organization_id,
            'worker': worker
        }
        obj, created = self.using(using).get_or_create(task_id=task_id,
                                                       defaults=fields)
        if not created:
            for k, v in fields.items():
                setattr(obj, k, v)
            obj.save(using=using)
        return obj


class OrgTaskResultMdl(TaskResultMdl):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    objects = OrgTaskResultManager()


class OrgPeriodicTask(PeriodicTask):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class UserIntStream(AbstractUser):
    is_integrator= models.BooleanField('integrator status', default=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,)
    email = models.EmailField('email address', blank=False )
    REQUIRED_FIELDS = ["organization","email"] # createsuperuser


# Create your models here.
def get_file_path(instance, filename):
    filename = "%s" % (uuid.uuid4())
    return os.path.join('uploads/sources', filename)


# types for frontend RSS, Upload, Job
class SourceType(models.Model):
    name = models.CharField(max_length=25,unique=True)
    api_endpoint = models.TextField(max_length=50,unique=True)

    def __str__(self):
        return self.name + " (" + str(self.id) + ")"


# name / active #
class Source(PolymorphicModel):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['name','organization'], name='unique_name'),
            ]

    name = models.CharField(max_length=100, )
    active = models.BooleanField(default=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)

    def __str__(self):
        return self.name + " (" + str(self.id) + ")"


class UploadSource(Source):
    extract_indicators = models.BooleanField(default=False)


# this will trigger an rss source to accept incoming intel
class RSSSource(Source):
    url = models.URLField(max_length=1000)
    extract_indicators = models.BooleanField(default=False)


class IndicatorType(models.Model):
    name = models.CharField(max_length=20, unique=True)


class IndicatorJob(models.Model):
    class Meta:
        constraints = [
                UniqueConstraint(fields=['name', 'organization'], name='unique_indicatorjob'),
                ]
    name = models.CharField(max_length=100, unique=True)
    active = models.BooleanField(default=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    indicator_types = models.ManyToManyField(IndicatorType)

    last_run = models.DateTimeField(blank=True, null=True)
    last_status = models.BooleanField(blank=True, null=True)
    arguments = models.TextField(max_length=1000, blank=True, default="")
    user = models.TextField(max_length=250)
    timeout = models.IntegerField(default=600) # seconds; default 10 mins


class IndicatorJobLog(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    date = models.DateTimeField(default=timezone.now)
    stderr = models.TextField()
    stdout = models.TextField()
    job = models.ForeignKey(IndicatorJob, on_delete=models.CASCADE)


class IndicatorJobVersion(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['job', 'version', 'organization'], name='indicator_unique_job_version'),
            ]

    job = models.ForeignKey(IndicatorJob, on_delete=models.CASCADE, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    zip = models.FileField(upload_to="job_scripts")
    version = VersionField()
    active = models.BooleanField(default=False)


class Job(models.Model):
    class Meta:
        constraints = [
                UniqueConstraint(fields=['name',  'organization'], name='unique_job'),
                ]

    name = models.CharField(max_length=100, )
    active = models.BooleanField(default=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)

    last_run = models.DateTimeField(blank=True, null=True)
    last_status = models.BooleanField(blank=True, null=True)
    arguments = models.TextField(max_length=1000, default="", blank=True)
    cron_day_of_week = models.TextField(max_length=20, )
    cron_day_of_month = models.TextField(max_length=10,)
    cron_month_of_year = models.TextField(max_length=20, )
    cron_hour = models.TextField(max_length=10, )
    cron_minute = models.TextField(max_length=10, )
    user = models.TextField(max_length=250)
    password = EncryptedTextField()
    timeout = models.IntegerField(default=600) # seconds; default 10 mins


class JobLog(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    date = models.DateTimeField(default=timezone.now)
    stderr = models.TextField()
    stdout = models.TextField()
    job = models.ForeignKey(Job, on_delete=models.CASCADE)


class JobVersion(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['job', 'version', 'organization'], name='unique_job_version'),
            ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    zip = models.FileField(upload_to="job_scripts")
    version = VersionField()
    active = models.BooleanField(default=False)


class TrainingScript(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['name', 'organization'], name='unique_script'),
            ]

    name = models.TextField(max_length=300)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)


class TrainingScriptVersion(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['script', 'version', 'organization'], name='unique_script_version'),
            ]
    script = models.ForeignKey(TrainingScript, on_delete=models.CASCADE, editable=False)
    zip = models.FileField(upload_to="train_scripts")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    version = VersionField()


class ModelVersion(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=["model"], condition=Q(active=True), name="unique_model_version")
        ]
        # only one model can have active = True
    # set on train
    model = models.ForeignKey('MLModel', on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    version = models.CharField(max_length=500, unique=True ) #job_name = model-id + time
    celery_log = models.FileField(upload_to="celery_logs",blank=True, null=True)
    metric_name = models.CharField(max_length=200)
    extra_kwargs = models.CharField(max_length=1000)
    task = models.CharField(max_length=500)
    status = models.CharField(max_length=100, default="NA")
    file = models.FileField(upload_to='model_versions',blank=True, null=True)
    metric_value = models.FloatField(blank=True, null=True)

    # set once activated for classification
    active = models.BooleanField(default=False)

    # set on classify history
    virtual_env_loc = models.CharField(max_length=1000, null=True, blank=True)

    training_script_version = models.ForeignKey(TrainingScriptVersion, on_delete=models.CASCADE, editable=True)


class ClassifyHistory(models.Model):
    start_classify = models.DateTimeField(blank=True, null=True)
    end_classify = models.DateTimeField(blank=True, null=True)
    task = models.CharField(max_length=500)
    version = models.ForeignKey(ModelVersion, on_delete=models.CASCADE)


class MLModel(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['name','organization'], name='unique_model_name'),
            ]

    sources = models.ManyToManyField(Source)
    name = models.CharField(max_length=250, )

    #todo no longer need script_directory
    script_directory = models.CharField(max_length=500, default=settings.DEFAULT_SCRIPT_MODEL)

    train_lock = models.BooleanField(default=True)
    created_date = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=False) # allow to show in gui
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    training_script = models.ForeignKey(TrainingScript, on_delete=models.CASCADE, editable=True)
    train_start_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.id)


class ArticleType(models.Model):
    name = models.CharField(max_length=100,unique=True)
    api_endpoint = models.TextField(max_length=100, unique=True)


class Article(PolymorphicModel):
    source = models.ForeignKey(Source,on_delete=models.CASCADE)
    title = models.TextField(max_length=1000)
    text = models.TextField(blank=True)
    upload_date = models.DateTimeField(default=timezone.now, db_index=True)
    encoding = models.CharField(max_length=15, default='utf8')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)

    def __str__(self):
        return self.title + " (" + str(self.id) + ")"


class TargetMLModelManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset().annotate(targetmlmodel=Concat(
            F('target'),Value("-"),F('mlmodel'),
            output_field=models.CharField()))


class Classification(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['article', 'mlmodel','organization'], name='unique_classification'),
            ]
    article = models.ForeignKey(Article,on_delete=models.CASCADE)
    target = models.BooleanField('target classification')
    mlmodel = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)


class Prediction(models.Model):
    """
    model predictions
    """
    class Meta:
        constraints = [
            UniqueConstraint(fields=['article', 'mlmodel','organization'], name='unique_model_classification'),
            ]

    article = models.ForeignKey(Article,on_delete=models.CASCADE)
    target = models.BooleanField('target classification')
    mlmodel = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)

# Upload Articles
class WordDocxArticle(Article):
    file = models.FileField(upload_to='article')


class PDFArticle(Article):
    file = models.FileField(upload_to='article')
    password = models.CharField(max_length=200,blank=True,null=True)


class TxtArticle(Article):
    file = models.FileField(upload_to='article')



class HtmlArticle(Article):
    file = models.FileField(upload_to='article')


# Rss Articles
class RSSArticle(Article):

    description = models.TextField(blank=True, null=True)
    link = models.URLField(max_length=2000)
    guid = models.CharField(max_length=2000,)


class RawArticle(Article):
    # used to upload article without a file
    extra = models.TextField(blank=True, null=True)


class Setting(models.Model):
    aws_key = EncryptedTextField(max_length=100)
    aws_secret = EncryptedTextField(max_length=250)
    aws_region = models.CharField(max_length=15)
    aws_s3_log_base = models.CharField(max_length=500)
    aws_s3_upload_base = models.CharField(max_length=500)
    ec2_key_name = models.CharField(max_length=500)
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, editable=False)


class Indicator(PolymorphicModel):
    articles = models.ManyToManyField(Article, blank=True)
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE, editable=False)
    ind_type = models.ForeignKey(IndicatorType, on_delete=models.CASCADE, editable=False)
    upload_date = models.DateTimeField(default=timezone.now, editable=False, db_index=True)


class IndicatorMD5(Indicator):
    value = models.TextField(max_length=32,
                             validators=[validators.RegexValidator(regex=r"^[0-9a-fA-F]{32}$",
                                                                   message="must be valid md5 hash")],
                             unique=True)


class IndicatorSha256(Indicator):
    value = models.TextField(max_length=64,
                             validators=[validators.RegexValidator(regex=r"^[0-9a-fA-F]{64}$",
                                                                   message="must be valid sha256"),],
                             unique=True)


class IndicatorSha1(Indicator):
    value = models.TextField(max_length=40,
                             validators=[validators.RegexValidator(regex=r"^[0-9a-fA-F]{40}$",
                                                                   message="must be valid sha1")],
                             unique=True)


class Suffix(models.Model):
    value = models.TextField(max_length=30,
                             unique=True)


class IndicatorNetLoc(Indicator):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['subdomain', 'domain', 'suffix'], name='unique_domain'),
            ]

    subdomain = models.TextField(blank=True,
                                 null=True,
                                 validators=[validators.RegexValidator(regex=r'[^a-zA-Z0-9\-]', inverse_match=True)],
                                 max_length=63)
    domain = models.TextField(validators=[validators.RegexValidator(regex=r'[^a-zA-Z0-9\-]', inverse_match=True)],
                              max_length=63)
    suffix = models.ForeignKey(Suffix, on_delete=models.CASCADE)

    def __str__(self):
        total = ""
        if self.subdomain != "":
            total = total + str(self.subdomain) + "."

        if self.domain != "":
            total = total + str(self.domain) + "."

        total = total + str(self.suffix)

        return total


class IndicatorEmail(Indicator):
    value = models.EmailField(unique=True)


class IndicatorIPV4(Indicator):
    value = models.GenericIPAddressField(protocol="IPv4",
                                         unique=True)
    ttl = models.IntegerField(default=14)


class IndicatorIPV6(Indicator):
    value = models.GenericIPAddressField(protocol="IPv6",
                                         unique=True)
    ttl = models.IntegerField(default=14)


class IndicatorCustomType(models.Model):
    name = models.TextField(max_length=500, unique=True)
    validator = models.TextField() # used to validate input in create
    #todo verification


class IndicatorCustom(Indicator):
    value = models.TextField(unique=True)
    type = models.ForeignKey(IndicatorCustomType, on_delete=models.CASCADE)


class IndicatorNumericField(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['indicator', 'name','organization'], name='unique_numeric_col'),
            ]

    value = models.FloatField()
    name = models.CharField(max_length=100)
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE, editable=False)
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE)
    update_date = models.DateTimeField(default=timezone.now, editable=False, db_index=True)


class IndicatorTextField(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['indicator', 'name','organization'], name='unique_text_col'),
            ]

    value = models.TextField()
    name = models.CharField(max_length=100)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE)
    update_date = models.DateTimeField(default=timezone.now, editable=False, db_index=True)

