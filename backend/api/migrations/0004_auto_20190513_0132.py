# Generated by Django 2.2 on 2019-05-13 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_userintstream_is_integrator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sourcetype',
            name='name',
            field=models.CharField(max_length=25, unique=True),
        ),
    ]