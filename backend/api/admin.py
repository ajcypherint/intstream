from django.contrib import admin

from . import models

admin.site.register(models.Categories)
admin.site.register(models.MLModel)
admin.site.register(models.TxtArticle)

# Register your models here.

