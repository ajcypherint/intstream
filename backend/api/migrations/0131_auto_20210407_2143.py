# Generated by Django 2.2.19 on 2021-04-08 01:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0130_auto_20210407_2132'),
    ]

    operations = [
        migrations.RenameField(
            model_name='indicator',
            old_name='finalized',
            new_name='reviewed',
        ),
    ]
