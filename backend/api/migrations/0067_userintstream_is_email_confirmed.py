# Generated by Django 2.2 on 2020-08-01 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0066_auto_20200725_1558'),
    ]

    operations = [
        migrations.AddField(
            model_name='userintstream',
            name='is_email_confirmed',
            field=models.BooleanField(default=False),
        ),
    ]
