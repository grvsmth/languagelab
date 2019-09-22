from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from languagelab.api.models import (
    Exercise, Language, Lesson, MediaItem, QueueItem
    )

from languagelab.api.serializers import (
    ExerciseSerializer,
    GroupSerializer,
    LanguageSerializer,
    LessonSerializer,
    MediaItemSerializer,
    QueueItemSerializer,
    UserSerializer
    )


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class LanguageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing available languages
    """
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer

class MediaItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing media items
    """
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing exercises
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class LessonViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing lessons
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class QueueItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing queue items
    """
    queryset = QueueItem.objects.all()
    serializer_class = QueueItemSerializer
