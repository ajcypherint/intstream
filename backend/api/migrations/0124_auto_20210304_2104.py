# Generated by Django 2.2.19 on 2021-03-05 02:04

from django.db import migrations, models
def update(apps, schema_editor):
    mdl = apps.get_model('api', 'IndicatorNetLoc')
    suffix_mdl = apps.get_model('api', 'Suffix')
    domains = mdl.objects.all()
    for d in domains:
        subdomain = d.subdomain + "." if d.subdomain != "" else ""
        full = subdomain + d.domain + "." + d.suffix.value
        d.value = full
        d.save()



class Migration(migrations.Migration):

    dependencies = [
        ('api', '0123_auto_20210220_1918'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicatornetloc',
            name='value',
            field=models.TextField(max_length=200, null=True),
            preserve_default=False
        ),
        migrations.RunPython(update),
        migrations.AlterField(
            model_name='indicatornetloc',
            name='value',
            field=models.TextField(max_length=200, null=False),
            preserve_default=False
        ),


    ]
