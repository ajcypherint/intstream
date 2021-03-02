# intstream
Cyber Intelligence classification and information summarization.

# install script
1. cd utilities
1. ./bash_install.sh

initial user: intstreamadmin
initial password: changeme@

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
`celery -A backend.celery:celery_app worker -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler`

## beat scheduler 
`celery -A backend.celery:celery_app beat -l info `

## worker only
`celery  -A backend.celery:celery_app worker -l info`

## backend
1. dump data `python manage.py dumpdata app.model_name --indent 4 > fixtures/file_name.json``

