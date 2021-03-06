# Generated by Django 2.2.19 on 2021-04-09 23:16

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import semantic_version.django_fields


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('api', '0131_auto_20210407_2143'),
    ]

    operations = [
        migrations.CreateModel(
            name='BaseIndicatorJob',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('active', models.BooleanField(default=True)),
                ('last_run', models.DateTimeField(blank=True, null=True)),
                ('last_status', models.BooleanField(blank=True, null=True)),
                ('arguments', models.TextField(blank=True, default='', max_length=1000)),
                ('timeout', models.IntegerField(default=600)),
                ('server_url', models.TextField(default='http://127.0.0.1:8000/', max_length=300)),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_api.baseindicatorjob_set+', to='contenttypes.ContentType')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StandardIndicatorJobVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('zip', models.FileField(upload_to='job_scripts')),
                ('version', semantic_version.django_fields.VersionField(coerce=False, max_length=200, partial=False, validators=[django.core.validators.RegexValidator(message='must be valid versionString', regex='\\d\\.\\d\\.\\d')])),
                ('active', models.BooleanField(default=False)),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
            ],
        ),
        migrations.RemoveField(
            model_name='indicatorjobversion',
            name='job',
        ),
        migrations.RemoveField(
            model_name='indicatorjobversion',
            name='organization',
        ),
        migrations.AlterField(
            model_name='indicatorjoblog',
            name='job',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.BaseIndicatorJob'),
        ),
        migrations.CreateModel(
            name='MitigateIndicatorJob',
            fields=[
                ('baseindicatorjob_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.BaseIndicatorJob')),
                ('indicator_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.IndicatorType')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.baseindicatorjob',),
        ),
        migrations.CreateModel(
            name='StandardIndicatorJob',
            fields=[
                ('baseindicatorjob_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.BaseIndicatorJob')),
                ('indicator_types', models.ManyToManyField(to='api.IndicatorType')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.baseindicatorjob',),
        ),
        migrations.CreateModel(
            name='UnmitigateIndicatorJob',
            fields=[
                ('baseindicatorjob_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.BaseIndicatorJob')),
                ('indicator_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.IndicatorType')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.baseindicatorjob',),
        ),
        migrations.DeleteModel(
            name='IndicatorJob',
        ),
        migrations.DeleteModel(
            name='IndicatorJobVersion',
        ),
        migrations.AddField(
            model_name='standardindicatorjobversion',
            name='job',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.StandardIndicatorJob'),
        ),
        migrations.AddConstraint(
            model_name='baseindicatorjob',
            constraint=models.UniqueConstraint(fields=('name', 'organization'), name='unique_indicatorjob'),
        ),
        migrations.AddConstraint(
            model_name='standardindicatorjobversion',
            constraint=models.UniqueConstraint(fields=('job', 'version', 'organization'), name='indicator_unique_job_version'),
        ),
        migrations.AddConstraint(
            model_name='standardindicatorjobversion',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('job', 'organization'), name='indicator_unique_job_version_active'),
        ),
    ]
