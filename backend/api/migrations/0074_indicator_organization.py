# Generated by Django 2.2 on 2020-09-17 00:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0073_auto_20200914_2041'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='organization',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.Organization'),
            preserve_default=False,
        ),
    ]
