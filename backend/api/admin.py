from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from . import forms
from . import models

class CustomUserAdmin(UserAdmin):
    add_form = forms.CustomUserCreationForm
    form = forms.CustomUserChangeForm
    model = models.UserIntStream
    list_display = ['email', 'username','is_staff','is_superuser','is_integrator']
    #add to fields sets permissions and remove others.
    list_editable = ['is_staff','is_superuser','is_integrator']


admin.site.register(models.Categories)
admin.site.register(models.MLModel)
admin.site.register(models.TxtArticle)
admin.site.register(models.UserIntStream,CustomUserAdmin)
#UserAdmin.list_display +=("is_integrator")
#UserAdmin.list_filter +=("is_integrator")
#UserAdmin.list_editable+=("is_integrator")
# Register your models here.

