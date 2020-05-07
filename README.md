# intstream
Cyber Intelligence classification and information summarization.

# Initiate shell
`python manage.py shell`

# dev environment
1. create a database named intstream and user intstream; give user access to database
2. `export PASSWORD=[user password]` 
3. `python manage.py shell`
4. `python manage.py migrate` 
5. `python manage.py runserver`

#dev fronend
1. `cd frontend`
2. `npm start`

## celery worker - development
`celery worker -A backend.celery:celery_app -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler`

## beat scheduler 
`celery beat -A backend.celery:celery_app -l info `

## worker only
`celery worker -A backend.celery:celery_app -l info`

## backend

