# Installation

These steps work for PythonAnywhere.  They should also work for other hosts,
with minor modifications.

* Clone this repository to your server
* Create a virtual environment for your application
* Activate the virtual environment
* Set up a web server.  If you are using Apache with mod_wsgi, you should add
  `WSGIPassAuthorization On` to your httpd configuration
* If you are using mod_wsgi, you should also add your virtual environment to
  your path, e.g. with `sys.path.append()` in your wsgi.py file
* Install Python dependencies: `pip install -r requirements.txt`
* Install the Javascript and CSS dependencies:
  `npm install --prefix=languagelab/static`
* Create a database and a database user with rights to that database
* Copy `languagelab/django_environ_empty.py` to `languagelab/django_environ.py`
* Edit `languagelab/django_environ.py` and fill in the details of your
  installation, including the database. In PythonAnywhere, make sure to include
  your username in the database name!
* Copy `languagelab/static/client/environment_empty.js` to
  `languagelab/static/client/environment.js`
* Edit `languagelab/static/client/environment.js` and fill in the API hostname
* Copy the static files including admin site styling:
  `python manage.py collectstatic`
* Run `python manage.py makemigrations languagelab`
* Run `python manage.py migrate`
* Run `python manage.py loaddata languagelab/api/fixtures/languages.json` to get
  the most common languages
* Create a superuser:
  `python manage.py createsuperuser --username=joe --email=joe@example.com`
* Restart your web server

