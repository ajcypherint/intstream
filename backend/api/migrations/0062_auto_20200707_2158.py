# Generated by Django 2.2 on 2020-07-08 01:58

from django.db import migrations

def insert(apps,schema_editor):
    #needed models
    script_model = apps.get_model('api', 'TrainingScript')
    script_version_model = apps.get_model('api', 'TrainingScriptVersion')
    script = script_model.objects.first()
    version = script_version_model.objects.first()
    models = apps.get_model("api","MlModel")
    model_versions = apps.get_model("api","ModelVersion")

    for i in models.objects.all():
        i.training_script=script
        i.save()

    for i in model_versions.objects.all():
        i.training_script_version = version
        i.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0061_auto_20200707_2133'),
    ]

    operations = [

        migrations.RunPython(insert),
    ]