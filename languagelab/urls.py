"""languagelab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from languagelab.api import views
from languagelab.settings import API_VERSION, STATIC_ROOT, STATIC_URL

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'languages', views.LanguageViewSet)
router.register(r'media', views.MediaItemViewSet)
router.register(r'exercises', views.ExerciseViewSet)
router.register(r'lessons', views.LessonViewSet)
router.register(r'queueItems', views.QueueItemViewSet)

urlpatterns = [
    path('api/{}/'.format(API_VERSION), include(router.urls)),
    path('admin/', admin.site.urls),
    path(
        'api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
        )
] + static(STATIC_URL, document_root=STATIC_ROOT)
