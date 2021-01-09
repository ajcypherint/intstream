from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
# set the default Django settings module for the 'celery' program.
from api import backend as back
celery_app = Celery('backend',
                    backend="api.backend.OrgDatabaseBackend",
                    include = ['api.tasks'])

from api import models
from api import tasks
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
celery_app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
celery_app.autodiscover_tasks()


@celery_app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    orgs = models.Organization.objects.all()
    ids = [org.id for org in orgs]

    # Calls test('hello') every 10 seconds.
    for i in ids:
        # test
        #sender.add_periodic_task(crontab(hour="*", minute="*/1"),
        #                         tasks.process_rss_sources.s(organization_id=i),
        #                         name='add every 1 process rss: ' + str(i))
        # prod
        sender.add_periodic_task(crontab(hour="*/1", minute="2"),
                                 tasks.process_rss_sources.s(organization_id=i),
                                 name='every hour process rss')

        sender.add_periodic_task(crontab(hour="1", minute="30"),
                                 tasks.remove_old_articles.s(organization_id=i),
                                 name='clean history freemium:' + str(i))

    # no reason to run this task for each org.  it is the suffix list.  just use the first org;
    # which will be the admin
    sender.add_periodic_task(crontab(day_of_week="0", hour="1", minute="30"),
                                 tasks.update_suffixes.s(organization_id=ids[0]),
                                 name='update tld')

#celery_app.conf.beat_schedule = {
#    # assign to single worker with concurrency = 1
#    "rss_sources":{
#        "task": "api.tasks.process_rss_sources",
#        "kwargs":{"organization_id":1},
#     #   "schedule": crontab(hour="*/1", minute="2") # every hour at 2 mins
#       "schedule": crontab(hour="*", minute="*/1") # testing
#    },
#    'clean_history_freemium': {
#        "task": "api.tasks.remove_old_articles",
#        "kwargs":{"organization_id":1},
#        "schedule": crontab(hour="1", minute="30") # every day at hour 1
#    },
#    'update_tld': {
#        "task": "api.tasks.update_suffixes",
#        "kwargs":{"organization_id":1},
#        "schedule": crontab(day_of_week="0", hour="1", minute="15")
#    }
#}


