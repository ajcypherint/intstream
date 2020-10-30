# Generated by Django 2.2 on 2020-10-28 23:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0099_auto_20201025_1910'),
    ]

    operations = [
        migrations.CreateModel(
            name='RawArticle',
            fields=[
                ('article_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.Article')),
                ('extra', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.article',),
        ),
    ]
