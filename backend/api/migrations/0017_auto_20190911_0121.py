# Generated by Django 2.2.5 on 2019-09-11 01:21

from django.db import migrations
from backend.urls import API
from ..urls import RSSSOURCE, UPLOADSOURCE, JOBSOURCE

def sourcetype_api_endpoints(apps,schema_editor):
    sourcetype = apps.get_model('api', 'SourceType')
    sourcetype.objects.filter(name="RSS").update(api_endpoint=API+RSSSOURCE)
    sourcetype.objects.filter(name="Upload").update(api_endpoint=API+UPLOADSOURCE)
    sourcetype.objects.filter(name="Job").update(api_endpoint=API+JOBSOURCE)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_sourcetype_api_endpoint'),
    ]

    operations = [
        migrations.RunPython(sourcetype_api_endpoints),
    ]