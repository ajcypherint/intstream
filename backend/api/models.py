from django.db import models
from django.utils import timezone
from polymorphic.models import PolymorphicModel

# Create your models here.


class Source(PolymorphicModel):
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    upload_date = models.DateTimeField(default=timezone.now)
    mlmodels = models.ManyToManyField('MLModel')

    def __str__(self):
        return self.name


class RssSource(Source):
    url = models.URLField()


class DocType(models.Model):
    name = models.CharField(max_length=25)
    extension = models.CharField(max_length=5)

    def __str__(self):
        return self.name


class DocumentSource(Source):
    document_type = models.ForeignKey(DocType,on_delete=models.CASCADE)


class MLModel(models.Model):
    sources = models.ManyToManyField(Source,through=Source.mlmodels.through)
    name = models.CharField(max_length=250)
    created_date = models.DateTimeField(default=timezone.now)
    base64_encoded_model = models.FileField()
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name + " ( " + self.id + ")"


class Categories(models.Model):
    name=models.CharField(max_length=100,unique=True)
    created_date = models.DateTimeField(default=timezone.now)
    model = models.ForeignKey(MLModel,on_delete=models.CASCADE)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name + " ( " + self.id + ")"


class Article(models.Model):
    source = models.ForeignKey(Source,on_delete=models.CASCADE)
    title = models.TextField(max_length=256)
    upload_date = models.DateTimeField(default=timezone.now)
    parent_match=models.ForeignKey('self',on_delete=models.CASCADE)
    categories = models.ManyToManyField(Categories)

