# Generated by Django 2.2.6 on 2019-11-21 01:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_auto_20191116_1024'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mlmodel',
            old_name='enabled',
            new_name='active',
        ),
        migrations.AddField(
            model_name='mlmodel',
            name='train',
            field=models.BooleanField(default=True),
        ),
    ]
