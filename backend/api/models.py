from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel
from django.contrib.auth.models import AbstractUser

import uuid
import os


class UserIntStream(AbstractUser):
    is_integrator= models.BooleanField('integrator status', default=False)


# Create your models here.
def get_file_path(instance, filename):
    filename = "%s" % (uuid.uuid4())
    return os.path.join('uploads/sources', filename)

#types for frontend RSS, Upload, Job
class SourceType(models.Model):
    name = models.CharField(max_length=25,unique=True)
    api_endpoint = models.TextField(max_length=50,unique=True)
    def __str__(self):
        return self.name + " (" + self.id + ")"


# name / active #
class Source(PolymorphicModel):
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

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
    name = models.CharField(max_length=250)
    created_date = models.DateTimeField(default=timezone.now)
    base64_encoded_model = models.FileField(blank=True)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name + " ( " + str(self.id) + ")"


class Categories(models.Model):
    name=models.CharField(max_length=100,unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    model = models.ForeignKey(MLModel,on_delete=models.CASCADE)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name + " ( " + str(self.id) + ")"

# name and api_endpoint for frontend  / sdk
class ArticleType(models.Model):
    name = models.CharField(max_length=100,unique=True)
    api_endpoint = models.TextField(max_length=100,unique=True)


class Article(PolymorphicModel):
    source = models.ForeignKey(Source,on_delete=models.CASCADE)
    title = models.TextField(max_length=256)
    text = models.TextField()
    upload_date = models.DateTimeField(default=timezone.now)
    match_articles=models.ManyToManyField('self',blank=True, null=True)
    categories = models.ManyToManyField(Categories,blank=True,null=True)
    encoding = models.CharField(max_length=15,default='utf8')


    def __str__(self):
        return self.title + "( " + str(self.id) + ")"

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
    aws_key = models.CharField(max_length=100)
    aws_secret = models.CharField(max_length=250)
    aws_region = models.CharField(max_length=15)
