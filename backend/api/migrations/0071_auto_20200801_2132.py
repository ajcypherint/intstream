# Generated by Django 2.2 on 2020-08-02 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0070_auto_20200801_1912'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userintstream',
            name='is_active',
            field=models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active'),
        ),
    ]
