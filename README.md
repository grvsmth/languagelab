# LanguageLab Library DRF

This app allows instructors to create exercises involving audio mimicry.  The
primary use case that I envison is for language lab type activities, but this
could also be used to practice dialect or gender speech, song or even
instrumental music.

There are two parts to the application: the backend *Library*, written in Python
to work with Django, and the frontend *Client*, written in Javascript to work
with React.

## License

Copyright 2021 Angus B. Grieve-Smith

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

## Requirements

The full list of Library requirements is in [requirements.txt](requirements.txt),
but the main requirements are Django, the Django Rest Framework and
Django-taggit.  The Client requirements are in [languagelab/static/package.json](/languagelab/static/package.json)
and include React, React-DOM, Moment.js, Bootstrap (requires jQuery) and the
Open Iconic icon library.

## Installation

* Set up an email account for registration, if necessary
* Clone this repository to your server
* Create a virtual environment for your application
* Activate the virtual environment
* Install Python dependencies: `pip install -r requirements.txt`
* Install the Javascript and CSS dependencies:
  `npm install --prefix=languagelab/static`
* Copy `languagelab/django_environ_empty.py` to `languagelab/django_environ.py`
* Edit `languagelab/django_environ.py` and fill in the details of your
  installation
* Copy `languagelab/static/client/environment_empty.js` to
  `languagelab/static/client/environment.js`
* Edit `languagelab/static/client/environment.js` and fill in the API hostname
* Copy the static files including admin site styling:
  `python manage.py collectstatic`
* Run `python manage.py makemigrations languagelab`
* Run `python manage.py migrate`
* Run `python manage.py loaddata languagelab/api/fixtures/languages.json`
* If you want languages that aren't on the language list, download them
* Create a superuser:
  `python manage.py createsuperuser --username=joe --email=joe@example.com`
* Restart your web server
* Log in to `/admin`, create your domain and delete `example.com` so that the
  links in the activation emails will work
* Change the `DJANGO_SITE_ID` value in your `django_environ.py` to the ID of the
  site you just created (probably 2)

## [Roadmap](roadmap.md)
