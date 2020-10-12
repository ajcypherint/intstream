# Generated by Django 2.2 on 2020-09-29 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0089_auto_20200922_2142'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobsource',
            name='python_binary_fullpath',
        ),
        migrations.RemoveField(
            model_name='jobsource',
            name='script_path',
        ),
        migrations.RemoveField(
            model_name='jobsource',
            name='task',
        ),
        migrations.RemoveField(
            model_name='jobsource',
            name='virtual_env_path',
        ),
        migrations.RemoveField(
            model_name='jobsource',
            name='working_dir',
        ),
        migrations.RemoveField(
            model_name='source',
            name='extract_indicators',
        ),
        migrations.AddField(
            model_name='indicatoripv4',
            name='ttl',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='indicatoripv6',
            name='ttl',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='jobsource',
            name='cron_day_of_month',
            field=models.TextField(default=0, max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobsource',
            name='cron_day_of_week',
            field=models.TextField(default=0, max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobsource',
            name='cron_hour',
            field=models.TextField(default=0, max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobsource',
            name='cron_minute',
            field=models.TextField(default=0, max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobsource',
            name='crontab_month_of_year',
            field=models.TextField(default=0, max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobsource',
            name='python_version',
            field=models.TextField(default=3.6, max_length=3),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobsource',
            name='script',
            field=models.FileField(default='test.py', upload_to='job_scripts'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='rsssource',
            name='extract_indicators',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='uploadsource',
            name='extract_indicators',
            field=models.BooleanField(default=False),
        ),
    ]
