from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models

admin.site.register(models.Categories)
admin.site.register(models.MLModel)
admin.site.register(models.TxtArticle)
admin.site.register(models.UserIntStream,UserAdmin)

# Register your models here.

