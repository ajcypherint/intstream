from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel
from django.contrib.auth.models import AbstractUser
from django.db.models.constraints import UniqueConstraint

import uuid
import os
from fernet_fields import EncryptedTextField


#todo(aj) mutitenant - organization table
# all queries filter by org
# Admin can see all orgs; add new orgs
# integrator can only see their own org; cannot add orgs
# Not integrator and not admin can only see their own org; cannot add orgs

class Organization(models.Model):
    name = models.CharField(max_length=200, unique=True)
    def __str__(self):
        return self.name


class UserIntStream(AbstractUser):
    is_integrator= models.BooleanField('integrator status', default=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,)
    REQUIRED_FIELDS = ["organization"] # createsuperuser


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
    pass


# this will trigger an rss source to accept incoming intel
class RSSSource(Source):
    url = models.URLField(max_length=1000)


# this will trigger a python script to run
class JobSource(Source):
    script_path = models.TextField(max_length=500)
    working_dir = models.TextField(max_length=500)
    virtual_env_path = models.TextField(max_length=500)
    python_binary_fullpath = models.TextField(max_length=500)
    last_run = models.DateTimeField(blank=True, null=True)
    last_status = models.BooleanField(blank=True, null=True)
    arguments = models.TextField(max_length=1000)
    task = models.TextField() # todo(aj) foreignkey to


class ModelVersion(models.Model):
    model = models.ForeignKey('MLModel',on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    version = models.CharField(max_length=500,unique=True ) #job_name = model-id + time
    metric_name = models.CharField(max_length=200)
    virtual_env_loc = models.CharField(max_length=1000, null=True)
    status = models.CharField(max_length=100, default="NA")
    file = models.FileField(upload_to='model_versions',blank=True, null=True)
    metric_value = models.FloatField(blank=True, null=True)


class MLModel(models.Model):
    class Meta:
        constraints = [
            UniqueConstraint(fields=['name','organization'], name='unique_model_name'),
            ]

    sources = models.ManyToManyField(Source)
    name = models.CharField(max_length=250, )
    script_directory = models.CharField(max_length=500, default="uuid-original-default")
    train_lock = models.BooleanField(default=True)
    created_date = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
    version_selected = models.ForeignKey(ModelVersion,on_delete=models.CASCADE,null=True)

    def __str__(self):
        return self.name + " (" + str(self.id) + ")"


# name and api_endpoint for frontend  / sdk
class ArticleType(models.Model):
    name = models.CharField(max_length=100,unique=True)
    api_endpoint = models.TextField(max_length=100, unique=True)


class Article(PolymorphicModel):
    source = models.ForeignKey(Source,on_delete=models.CASCADE)
    title = models.TextField(max_length=256)
    text = models.TextField(blank=True)
    upload_date = models.DateTimeField(default=timezone.now)
    encoding = models.CharField(max_length=15, default='utf8')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)

    def __str__(self):
        return self.title + " (" + str(self.id) + ")"


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
    link = models.URLField()
    guid = models.CharField(max_length=800,)


class Setting(models.Model):
    aws_key = EncryptedTextField(max_length=100)
    aws_secret = EncryptedTextField(max_length=250)
    aws_region = models.CharField(max_length=15)
    aws_s3_log_base = models.CharField(max_length=500)
    aws_s3_upload_base = models.CharField(max_length=500)
    ec2_key_name = models.CharField(max_length=500)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
