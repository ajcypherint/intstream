# Generated by Django 2.2 on 2020-12-17 03:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0111_auto_20201213_2135'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='ind_type',
            field=models.ForeignKey(default=1, editable=False, on_delete=django.db.models.deletion.CASCADE, to='api.IndicatorType'),
            preserve_default=False,
        ),
    ]