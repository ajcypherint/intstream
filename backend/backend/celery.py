from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

celery_app = Celery('backend')

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
# add "birthdays_today" task to the beat schedule

celery_app.conf.beat_schedule = {
    "add-task": {
        "task": "api.tasks.add",
        "schedule": crontab(hour='*', minute='*/1'), # every 1 mins
        "args":(2,2)
    },
    # assign to single worker with concurrency = 1
    "rss_sources":{
        "task":"api.tasks.process_rss_sources",
        "schedule": crontab(hour="*", minute="*/2") # every 2 mins
    }
}

