# Generated by Django 2.2 on 2020-09-18 01:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0077_remove_organization_is_freemium'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='freemium',
            field=models.BooleanField(default=False, verbose_name='freemium account'),
        ),
    ]
