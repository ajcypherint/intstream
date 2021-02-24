from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
# set the default Django settings module for the 'celery' program.
celery_app = Celery('backend',
                    backend="api.backend.OrgDatabaseBackend",
                    include = ['api.tasks'])

celery_app.config_from_object('django.conf:settings', namespace='CELERY')
from api import models
from api import tasks
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.

# Load task modules from all registered Django app configs.
celery_app.autodiscover_tasks()


@celery_app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))



# you MUST use args with args params tasks and kwargs with Kwarg params with tasks or bugs galore
# using .connect here for some reason causes a hang

celery_app.conf.beat_schedule = {
    # assign to single worker with concurrency = 1
    "rss_sources":{
        "task": "api.tasks.process_rss_sources_all",
        "kwargs":{"organization_id":1},
        "schedule": crontab(hour="*/1", minute="2") # every hour at 2 mins
     #  "schedule": crontab(hour="*", minute="*/1") # testing
    },
    'clean_history_freemium': {
        "task": "api.tasks.remove_old_articles_all",
        "kwargs":{"organization_id":1},
        "schedule": crontab(hour="1", minute="30") # every day at hour 1
    },
    'update_tld': {
        "task": "api.tasks.update_suffixes",
        "kwargs":{"organization_id":1},
        "schedule": crontab(day_of_week="0", hour="1", minute="15")
    }
}


