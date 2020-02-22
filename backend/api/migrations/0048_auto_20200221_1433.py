# Generated by Django 2.2 on 2020-02-21 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_auto_20200221_1218'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='modelactiveversion',
            name='model',
        ),
        migrations.RemoveField(
            model_name='modelactiveversion',
            name='organization',
        ),
        migrations.RemoveField(
            model_name='modelactiveversion',
            name='version',
        ),
        migrations.AddField(
            model_name='modelversion',
            name='active',
            field=models.BooleanField(default=False),
        ),
        migrations.AddConstraint(
            model_name='modelversion',
            constraint=models.UniqueConstraint(condition=models.Q(active=True), fields=('model',), name='unique_model_version'),
        ),
        migrations.DeleteModel(
            name='ModelActiveVersion',
        ),
    ]
