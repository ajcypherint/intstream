# Generated by Django 2.2 on 2020-07-09 04:55

from django.db import migrations

import os
import tempfile

from django.db import migrations
from django.core.files import File
from django.conf import settings


def insert(apps,schema_editor):
    #needed models
    script_model = apps.get_model('api', 'TrainingScript')
    script_version_model = apps.get_model('api', 'TrainingScriptVersion')
    org_model = apps.get_model("api", "Organization")

    # system org
    system_org = org_model.objects.get(name=settings.SYSTEM_ORG)

    # default script
    default_script = script_model.objects.get(name="default", organization=system_org)

    version = script_version_model.objects.get(script=default_script,
                                                      version="1.1.1",
                                                      organization=system_org)

    #create default training script version
    with open(os.path.join(settings.BASE_DIR,"aws_training_files/default.tar.gz"), "rb") as f:
        tf = tempfile.NamedTemporaryFile(dir=os.path.join(settings.BASE_DIR,"media"))
        tf.write(f.read())
        version.zip = File(tf)
        version.save()



class Migration(migrations.Migration):

    dependencies = [
        ('api', '0064_auto_20200709_0055'),
    ]

    operations = [
        migrations.RunPython(insert),

    ]
