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
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from languagelab.api.views import(
    UserViewSet,
    GroupViewSet,
    LanguageViewSet,
    MediaItemViewSet,
    ExerciseViewSet,
    LessonViewSet,
    QueueItemViewSet,
    current_user,
    all
    )
from languagelab.settings import API_VERSION, STATIC_ROOT, STATIC_URL

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'languages', LanguageViewSet)
router.register(r'media', MediaItemViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'queueItems', QueueItemViewSet)

urlpatterns = [
    path('api/{}/'.format(API_VERSION), include(router.urls)),
    path('admin/', admin.site.urls),
    path(
        'api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
        ),
    path('api/{}/all/'.format(API_VERSION), all),
    path('api/{}/currentUser/'.format(API_VERSION), current_user),
    path('api/{}/token-auth/'.format(API_VERSION), obtain_jwt_token),
    path('api/{}/token-refresh/'.format(API_VERSION), refresh_jwt_token)
] + static(STATIC_URL, document_root=STATIC_ROOT)
