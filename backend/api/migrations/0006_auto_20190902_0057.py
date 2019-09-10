# Generated by Django 2.2 on 2019-09-02 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20190526_0128'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='parent_match',
        ),
        migrations.AddField(
            model_name='article',
            name='match_article',
            field=models.ManyToManyField(blank=True, null=True, related_name='_article_match_article_+', to='api.Article'),
        ),
    ]