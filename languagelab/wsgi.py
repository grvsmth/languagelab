"""
WSGI config for languagelab project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os
# import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'languagelab.settings')

"""
If you are using mod_wsgi, uncomment the line below and put in the path to your
site-packages directory.  Also uncomment the `import sys` line above!

"""
# sys.path.append('/path/to/your/site-packages')

application = get_wsgi_application()
