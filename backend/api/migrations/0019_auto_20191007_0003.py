# Generated by Django 2.2.5 on 2019-10-07 00:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20191006_0026'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rssarticle',
            old_name='quid',
            new_name='guid',
        ),
    ]
