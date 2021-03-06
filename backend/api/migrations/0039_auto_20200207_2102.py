# Generated by Django 3.0.2 on 2020-02-08 02:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_auto_20200121_1933'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mlmodel',
            old_name='train',
            new_name='train_lock',
        ),
        migrations.RemoveField(
            model_name='mlmodel',
            name='base64_encoded_model',
        ),
        migrations.CreateModel(
            name='ModelVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.CharField(max_length=500)),
                ('metric_name', models.CharField(max_length=200)),
                ('status', models.CharField(default='NA', max_length=100)),
                ('file', models.FileField(blank=True, null=True, upload_to='model_versions')),
                ('selected', models.BooleanField(default=False)),
                ('metric_value', models.FloatField(blank=True, null=True)),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.MLModel')),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
            ],
        ),
        migrations.AddConstraint(
            model_name='modelversion',
            constraint=models.UniqueConstraint(fields=('version', 'organization'), name='unique_model_version'),
        ),
    ]
