# Generated by Django 2.2 on 2020-11-05 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0101_auto_20201102_1402'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndicatorTypes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='indicatorjob',
            name='source',
        ),
        migrations.AddField(
            model_name='indicatorjob',
            name='indicator_types',
            field=models.ManyToManyField(to='api.IndicatorTypes'),
        ),
    ]