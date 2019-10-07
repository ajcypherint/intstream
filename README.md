# intstream

Cyber Intelligence classification and information summarization.

# Initiate shell
`python manage.py shell`

# Celery
## worker - development
`celery worker -A backend.celery:celery_app -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler`

## beat scheduler 
`celery beat -A backend.celery:celery_app -l info `

## worker only
`celery worker -A backend.celery:celery_app -l info`


