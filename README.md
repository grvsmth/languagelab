# LanguageLab Library DRF

This app allows instructors to create exercises involving audio mimicry.  The
primary use case that I envison is for language lab type activities, but this
could also be used to practice dialect or gender speech, song or even
instrumental music.

## Requirements

The full list of backend requirements is at [requirements.txt], but the main
requirements are Django, the Django Rest Framework and Django-taggit.  The
frontend requirements are as follows:

* React and React-DOM
* Moment.js
* Bootstrap (requires jQuery)

## INSTALLATION

* Set up an email account for registration, if necessary
* Clone this repository to your server
* Create a virtual environment for your application
* Activate the virtual environment
* Install dependencies: `pip install -r requirements.txt`
* Copy `languagelab/django_environ_empty.py` to `languagelab/django_environ.py`
* Edit `languagelab/django_environ.py` and fill in the details of your installation
* Copy the static files including admin site styling: `python manage.py collectstatic`
* Run `python manage.py makemigrations mimic`
* Run `python manage.py migrate`
* Create a superuser: `python manage.py createsuperuser --username=joe --email=joe@example.com`
* Restart your web server
* Log in to `/admin`, create your domain and delete `example.com` so that the links in the activation emails will work
* Change the `DJANGO_SITE_ID` value in your `django_environ.py` to the ID of the site you just created (probably 2)
* If you want languages that aren't on the language list, download them


