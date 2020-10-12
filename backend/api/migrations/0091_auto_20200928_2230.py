# Generated by Django 2.2 on 2020-09-29 02:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0090_auto_20200928_2149'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='indicatornetloc',
            options={},
        ),
        migrations.AlterField(
            model_name='indicatorcustom',
            name='value',
            field=models.TextField(unique=True),
        ),
        migrations.AlterField(
            model_name='indicatorcustomtype',
            name='name',
            field=models.TextField(max_length=500, unique=True),
        ),
        migrations.AlterField(
            model_name='indicatoripv4',
            name='value',
            field=models.GenericIPAddressField(protocol='IPv4', unique=True),
        ),
        migrations.AlterField(
            model_name='indicatoripv6',
            name='value',
            field=models.GenericIPAddressField(protocol='IPv6', unique=True),
        ),
        migrations.AlterField(
            model_name='indicatormd5',
            name='value',
            field=models.TextField(max_length=32, unique=True),
        ),
        migrations.AlterField(
            model_name='indicatorsha1',
            name='value',
            field=models.TextField(max_length=40, unique=True),
        ),
        migrations.AlterField(
            model_name='indicatorsha256',
            name='value',
            field=models.TextField(max_length=64, unique=True),
        ),
        migrations.AlterField(
            model_name='indicatorurl',
            name='value',
            field=models.URLField(unique=True),
        ),
        migrations.AddConstraint(
            model_name='indicatornetloc',
            constraint=models.UniqueConstraint(fields=('subdomain', 'domain', 'suffix'), name='unique_domain'),
        ),
    ]