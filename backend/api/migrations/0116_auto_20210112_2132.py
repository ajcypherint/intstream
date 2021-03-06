# Generated by Django 2.2 on 2021-01-13 02:32

from django.db import migrations
from api import models

def update_intstreamadmin(apps, schema_editor):
    user = models.UserIntStream.objects.get(username="intstreamadmin")
    user.is_integrator = True
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0115_auto_20210108_2031'),
    ]

    operations = [
        migrations.RunPython(update_intstreamadmin)
    ]
