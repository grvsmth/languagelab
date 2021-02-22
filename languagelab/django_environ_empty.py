"""

Environment variables for Django

"""
from json import dumps
from os import environ

def set_environ():
    """
    Update the environment variables
    """
    environ.update({
        'DJANGO_SITE_ID': '1',
        'DJANGO_SECRET_KEY': '',
        'DJANGO_HOST': '',
        'DJANGO_DB': '',
        'DJANGO_DB_USER': '',
        'DJANGO_DB_PASSWORD': '',
        'DJANGO_DB_HOST': '',
        'DJANGO_DB_PORT': '',
        'DJANGO_DB_ENGINE': '',
        'DJANGO_DB_OPTIONS': dumps({
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
            }),
        'DJANGO_FROM_EMAIL': '',
        'DJANGO_EMAIL_HOST': '',
        'DJANGO_EMAIL_HOST_USER': '',
        'DJANGO_EMAIL_HOST_PASSWORD': '',
        'DJANGO_MEDIA_ROOT': '',
        'DJANGO_TEMPLATES_DIR': '',
        'DJANGO_ALLOWED_HOSTS': '[]',
        'DJANGO_TIMEZONE': '',
        'JWT_EXPIRATION': '1',
        'JWT_EXPIRATION_UNITS': 'hours'
        })
