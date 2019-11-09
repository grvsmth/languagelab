from django.contrib.auth.models import User, Group
from django.db.models import Max
from django.http import JsonResponse

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.serializers import (
    CurrentUserDefault,
    IntegerField,
    PrimaryKeyRelatedField
    )

from logging import basicConfig, getLogger

from languagelab.api.iso639client import getIso639, makeLanguage

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

LOG = getLogger()
basicConfig(level="DEBUG")


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

    @action(detail=False, methods=['post'])
    def updateAll(self, request):
        counter = 0
        res = getIso639()

        for entry in res:
            language = makeLanguage(entry)
            language.save()
            counter += 1

        return JsonResponse({"success": "true", "items": counter})


class MediaItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing media items
    """
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer

    uploader = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing exercises
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing lessons
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    creator = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class QueueItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for viewing queue items
    """
    queryset = QueueItem.objects.all()
    serializer_class = QueueItemSerializer

    user = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )
    rank = IntegerField(read_only=True, min_value=1, default=1)

    def nextRank(self):
        nextRank = 1
        userItems = self.queryset.filter(user=self.request.user)
        maxRank = userItems.aggregate(Max('rank'))['rank__max']

        if maxRank:
            nextRank = maxRank + 1

        return nextRank

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, rank=self.nextRank())
        QueueItem.objects.renumber(user=self.request.user)

