# Generated by Django 2.2.19 on 2021-08-22 01:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0146_auto_20210726_2324'),
    ]

    operations = [
        migrations.CreateModel(
            name='HtmlUploadSource',
            fields=[
                ('source_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.Source')),
                ('extract_indicators', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.source',),
        ),
    ]
