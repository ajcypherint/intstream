# Generated by Django 2.2 on 2020-02-21 16:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0044_mlmodel_script_directory'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mlmodel',
            name='version_selected',
        ),
        migrations.CreateModel(
            name='MLModelActiveVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.MLModel')),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
                ('version', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ModelVersion')),
            ],
        ),
    ]
