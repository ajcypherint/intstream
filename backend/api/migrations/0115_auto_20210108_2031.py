# Generated by Django 2.2 on 2021-01-09 01:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('django_celery_results', '0007_remove_taskresult_hidden'),
        ('api', '0114_orgperiodictask_orgtaskresult'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='OrgTaskResult',
            new_name='OrgTaskResultMdl',
        ),
    ]
