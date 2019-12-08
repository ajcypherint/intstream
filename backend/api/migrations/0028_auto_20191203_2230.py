# Generated by Django 2.2.6 on 2019-12-04 03:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_auto_20191120_2052'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='categories',
        ),
        migrations.CreateModel(
            name='Classification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target', models.BooleanField(verbose_name='target classification')),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Article')),
                ('mlmodel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.MLModel')),
                ('organization', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.Organization')),
            ],
        ),
    ]