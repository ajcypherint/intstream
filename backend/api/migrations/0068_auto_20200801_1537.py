# Generated by Django 2.2 on 2020-08-01 19:37

from django.db import migrations


def insert(apps, schema_editor):
    user_model = apps.get_model('api', 'UserIntstream')
    all_users = user_model.objects.all()

    for user in all_users:
        user.is_email_confirmed = True
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0067_userintstream_is_email_confirmed'),
    ]

    operations = [

        migrations.RunPython(insert),
    ]
