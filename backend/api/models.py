from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel
from django.contrib.auth.models import AbstractUser

import uuid
import os


class UserIntStream(AbstractUser):
    pass

# Create your models here.
def get_file_path(instance, filename):
    filename = "%s" % (uuid.uuid4())
    return os.path.join('uploads/sources', filename)

# RSS, UPLOAD # for display on frontend
class SourceType(models.Model):
    name = models.CharField(max_length=25)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Source(PolymorphicModel):
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class UploadSource(Source):
    pass

class RSSSource(Source):
    url = models.URLField(max_length=1000)

class MLModel(models.Model):
    sources = models.ManyToManyField(Source,blank=True,null=True)
    name = models.CharField(max_length=250)
    created_date = models.DateTimeField(default=timezone.now)
    base64_encoded_model = models.FileField()
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


class Article(PolymorphicModel):
    source = models.ForeignKey(Source,on_delete=models.CASCADE)
    title = models.TextField(max_length=256)
    text = models.TextField()
    upload_date = models.DateTimeField(default=timezone.now)
    parent_match=models.ForeignKey('self',on_delete=models.CASCADE,blank=True,null=True)
    categories = models.ManyToManyField(Categories,blank=True,null=True)
    file = models.FileField(upload_to='article')
    encoding = models.CharField(max_length=15,default='utf8')


    def __str__(self):
        return self.title + "( " + str(self.id) + ")"

class PDFArticle(Article):
    password = models.CharField(max_length=200)

class TxtArticle(Article):
    pass

class RssArticle(Article):
    pass
