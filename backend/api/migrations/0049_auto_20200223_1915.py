# Generated by Django 2.2 on 2020-02-24 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0048_auto_20200221_1433'),
    ]

    operations = [
        migrations.AddField(
            model_name='modelversion',
            name='start_classify',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='modelversion',
            name='task',
            field=models.CharField(default='xxxx', max_length=500),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='modelversion',
            name='virtual_env_loc',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
