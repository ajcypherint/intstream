# Generated by Django 2.2 on 2020-05-02 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0055_auto_20200418_1008'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userintstream',
            name='email',
            field=models.EmailField(max_length=254, verbose_name='email address'),
        ),
    ]