from django.contrib import admin

from . import models

admin.site.register(models.Categories)
admin.site.register(models.DocumentSource)
admin.site.register(models.RssSource)
admin.site.register(models.MLModel)
admin.site.register(models.DocType)
admin.site.register(models.Article)

# Register your models here.

