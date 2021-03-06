# Generated by Django 2.2.19 on 2021-03-19 01:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0126_auto_20210318_2127'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='indicatorjob',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('name', 'organization'), name='unique_indicatorjob_active'),
        ),
        migrations.AddConstraint(
            model_name='indicatorjobversion',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('job', 'version', 'organization'), name='indicator_unique_job_version_active'),
        ),
        migrations.AddConstraint(
            model_name='job',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('name', 'organization'), name='unique_job_active'),
        ),
        migrations.AddConstraint(
            model_name='jobversion',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('job', 'version', 'organization'), name='unique_job_version_active'),
        ),
        migrations.AddConstraint(
            model_name='trainingscript',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('name', 'organization'), name='unique_script_active'),
        ),
        migrations.AddConstraint(
            model_name='trainingscriptversion',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('script', 'version', 'organization'), name='unique_script_version_active'),
        ),
    ]
