# Generated by Django 3.0.2 on 2020-01-21 03:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_auto_20200120_2211'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rssarticle',
            name='guid',
            field=models.CharField(max_length=800),
        ),
    ]
