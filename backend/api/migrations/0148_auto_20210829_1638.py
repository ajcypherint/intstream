# Generated by Django 2.2.19 on 2021-08-29 20:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0147_htmluploadsource'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileUploadSource',
            fields=[
                ('source_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.Source')),
                ('extract_indicators', models.BooleanField(default=False)),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.SourceType')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.source',),
        ),
        migrations.CreateModel(
            name='KeyValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.TextField(max_length=1000)),
                ('value', models.TextField()),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
            ],
        ),
        migrations.AddField(
            model_name='htmlarticle',
            name='read_task',
            field=models.TextField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='pdfarticle',
            name='read_task',
            field=models.TextField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='txtarticle',
            name='read_task',
            field=models.TextField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='worddocxarticle',
            name='read_task',
            field=models.TextField(blank=True, max_length=300, null=True),
        ),
        migrations.DeleteModel(
            name='HtmlUploadSource',
        ),
        migrations.AddConstraint(
            model_name='keyvalue',
            constraint=models.UniqueConstraint(fields=('key', 'organization'), name='unique_key_col'),
        ),
    ]
