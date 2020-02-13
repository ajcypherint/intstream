"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
AWS_TRAIN_FILES = os.path.join(BASE_DIR,"aws_training_files")
VENV_DIR = "/tmp"
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Use a separate file for the secret key
with open(os.path.join(BASE_DIR, 'secretkey.txt')) as f:
    SECRET_KEY = f.read().strip()

# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = True
#default to false
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() in ['true','yes']
ALLOWED_HOSTS = ['*']

# Application definition


INSTALLED_APPS = [
    'api.apps.ApiConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'polymorphic',
    'django_generate_secret_key',
    'django_filters',
    'drf_yasg',
    'django_celery_beat'
    #'django_s3_storage'
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_PERMISSION_CLASSES': (
        'api.permissions.IsAuthandReadOnlyOrAdminOrIntegrator',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    )

}
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'intstream',
        'USER':'intstream',
        'PASSWORD':os.environ.get('PASSWORD','hinton50'),
        'HOST':'localhost',
        'PORT':'5432',
    }
}

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        "api_key":{
            "type":"apiKey",
            "name":"Authorization",
            "in":"header"
        }
    }
}
# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators
AUTH_USER_MODEL="api.UserIntStream"
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = os.environ.get("TIMEZONE",'America/New_York')

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/
LOGIN_REDIRECT_URL='/api/docs'

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR,'static')
# The name of the bucket to store files in.

# TFIDF needs to reprocess on every file input.  it needs the whole corpus every time.
# reading from S3 is not a good idea
"""
DEFAULT_FILE_STORAGE = "django_s3_storage.storage.S3Storage"
# The AWS region to connect to.
AWS_REGION = os.environ.get("AWS_REGION","us-east-1")

# The AWS access key to use.
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID","")

# The AWS secret access key to use.
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY","")

# The optional AWS session token to use.
AWS_SESSION_TOKEN = os.environ.get("AWS_SESSION_TOKEN","")

AWS_S3_BUCKET_NAME = os.environ.get("AWS_S3_BUCKET_NAME","")

# How to construct S3 URLs ("auto", "path", "virtual").
AWS_S3_ADDRESSING_STYLE = os.environ.get("AWS_S3_ADDRESSING_STYLE","auto")

# The full URL to the S3 endpoint. Leave blank to use the default region URL.
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL","")

# A prefix to be applied to every stored file. This will be joined to every filename using the "/" separator.
AWS_S3_KEY_PREFIX = os.environ.get("AWS_S3_KEY_PREFIX","")

# Whether to enable authentication for stored files. If True, then generated URLs will include an authentication
# token valid for `AWS_S3_MAX_AGE_SECONDS`. If False, then generated URLs will not include an authentication token,
# and their permissions will be set to "public-read".
AWS_S3_BUCKET_AUTH = True if os.environ.get("AWS_S3_BUCKET_AUTH","true").lower() == "true" else False

# How long generated URLs are valid for. This affects the expiry of authentication tokens if `AWS_S3_BUCKET_AUTH`
# is True. It also affects the "Cache-Control" header of the files.
# Important: Changing this setting will not affect existing files.
AWS_S3_MAX_AGE_SECONDS = int(os.environ.get("AWS_S3_MAX_AGE_SECONDS",60 * 60))  # 1 hours.

# A URL prefix to be used for generated URLs. This is useful if your bucket is served through a CDN. This setting
# cannot be used with `AWS_S3_BUCKET_AUTH`.
AWS_S3_PUBLIC_URL = os.environ.get("AWS_S3_PUBLIC_URL","")

# If True, then files will be stored with reduced redundancy. Check the S3 documentation and make sure you
# understand the consequences before enabling.
# Important: Changing this setting will not affect existing files.
AWS_S3_REDUCED_REDUNDANCY = False if os.environ.get("AWS_S3_REDUCED_REDUNDANCY","false").lower() == "false" else True

# The Content-Disposition header used when the file is downloaded. This can be a string, or a function taking a
# single `name` argument.
# Important: Changing this setting will not affect existing files.
AWS_S3_CONTENT_DISPOSITION = os.environ.get("AWS_S3_CONTENT_DISPOSITION","")

# The Content-Language header used when the file is downloaded. This can be a string, or a function taking a
# single `name` argument.
# Important: Changing this setting will not affect existing files.
AWS_S3_CONTENT_LANGUAGE = os.environ.get("AWS_S3_CONTENT_LANGUAGE","")

# A mapping of custom metadata for each file. Each value can be a string, or a function taking a
# single `name` argument.
# Important: Changing this setting will not affect existing files.
AWS_S3_METADATA = {}

# If True, then files will be stored using AES256 server-side encryption.
# If this is a string value (e.g., "aws:kms"), that encryption type will be used.
# Otherwise, server-side encryption is not be enabled.
# Important: Changing this setting will not affect existing files.
AWS_S3_ENCRYPT_KEY = False if os.environ.get("AWS_S3_ENCRYPT_KEY","false").lower() == "false" else True

# The AWS S3 KMS encryption key ID (the `SSEKMSKeyId` parameter) is set from this string if present.
# This is only relevant if AWS S3 KMS server-side encryption is enabled (above).
AWS_S3_KMS_ENCRYPTION_KEY_ID = os.environ.get("AWS_S3_KMS_ENCRYPTION_KEY_ID","")

# If True, then text files will be stored using gzip content encoding. Files will only be gzipped if their
# compressed size is smaller than their uncompressed size.
# Important: Changing this setting will not affect existing files.
AWS_S3_GZIP = True if os.environ.get("AWS_S3_GZIP","true").lower() == "true" else False

# The signature version to use for S3 requests.
AWS_S3_SIGNATURE_VERSION = None

# If True, then files with the same name will overwrite each other. By default it's set to False to have
# extra characters appended.
AWS_S3_FILE_OVERWRITE = False if os.environ.get("AWS_S3_FILE_OVERWRITE","false").lower() == "false" else True
"""

# celery
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=120)
}
