# Generated by Django 2.2.19 on 2021-04-18 21:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0139_auto_20210418_1621'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainingscriptversion',
            name='task_create_script_path',
        ),
        migrations.RemoveField(
            model_name='trainingscriptversion',
            name='task_create_virtual_env',
        ),
    ]
