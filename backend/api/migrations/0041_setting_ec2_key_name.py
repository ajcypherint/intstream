# Generated by Django 3.0.2 on 2020-02-08 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0040_auto_20200208_1012'),
    ]

    operations = [
        migrations.AddField(
            model_name='setting',
            name='ec2_key_name',
            field=models.CharField(default='CypherInt-Master-Key', max_length=500),
            preserve_default=False,
        ),
    ]
