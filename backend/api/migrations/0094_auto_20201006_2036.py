# Generated by Django 2.2 on 2020-10-07 00:36

from django.db import migrations, models
import django.db.models.deletion
import semantic_version.django_fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0093_auto_20200930_2142'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobsource',
            name='script',
        ),
        migrations.CreateModel(
            name='JobVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('script', models.FileField(upload_to='job_scripts')),
                ('version', semantic_version.django_fields.VersionField(coerce=False, max_length=200, partial=False)),
                ('job', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.JobSource')),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
            ],
        ),
        migrations.AddConstraint(
            model_name='jobversion',
            constraint=models.UniqueConstraint(fields=('job', 'version', 'organization'), name='unique_job_version'),
        ),
    ]