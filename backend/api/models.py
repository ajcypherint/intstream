from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel
from django.contrib.auth.models import AbstractUser
from django.db.models.constraints import UniqueConstraint

import uuid
import os

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
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
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
    name = models.CharField(max_length=100, unique=True)
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


class MLModel(models.Model):
    sources = models.ManyToManyField(Source)
    name = models.CharField(max_length=250, unique=True)
    train = models.BooleanField(default=True)
    created_date = models.DateTimeField(default=timezone.now)
    base64_encoded_model = models.FileField(blank=True,null=True)
    active = models.BooleanField(default=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)

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
    match=models.ManyToManyField('self',blank=True, null=True )
    encoding = models.CharField(max_length=15,default='utf8')
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
    guid = models.CharField(max_length=200,unique=True)


class Settings(models.Model):
    similarity_threshold = models.IntegerField()
    aws_key = models.CharField(max_length=100)
    aws_secret = models.CharField(max_length=250)
    aws_region = models.CharField(max_length=15)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, editable=False)
