"""

Views for the Language Lab REST API

"""
from django.contrib.auth.models import User, Group
from django.db.models import Max
from django.http import JsonResponse

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.serializers import (
    CurrentUserDefault,
    IntegerField,
    PrimaryKeyRelatedField
    )
from rest_framework.status import HTTP_204_NO_CONTENT

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
    UserSerializer,
    UserSerializerWithToken
    )

LOG = getLogger()
basicConfig(level="DEBUG")


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by token and return the data
    """

    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)

class UserViewSet(ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializerWithToken


class GroupViewSet(ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer


class LanguageViewSet(ModelViewSet):
    """
    API endpoint for viewing available languages
    """
    queryset = Language.objects.all().order_by('id')
    serializer_class = LanguageSerializer

    @action(detail=False, methods=['post'])
    def update_all(self, request):
        """
        Update all the languages from the source
        """
        counter = 0
        res = getIso639()

        for entry in res:
            language = makeLanguage(entry)
            language.save()
            counter += 1

        return JsonResponse({"success": "true", "items": counter})


class MediaItemViewSet(ModelViewSet):
    """
    API endpoint for viewing media items
    """
    queryset = MediaItem.objects.all().order_by('id')
    serializer_class = MediaItemSerializer

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)


class ExerciseViewSet(ModelViewSet):
    """
    API endpoint for viewing exercises
    """
    queryset = Exercise.objects.all().order_by('id')
    serializer_class = ExerciseSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        QueueItem.objects.renumber(user=self.request.user)
        return Response(status=HTTP_204_NO_CONTENT)


class LessonViewSet(ModelViewSet):
    """
    API endpoint for viewing lessons
    """
    queryset = Lesson.objects.all().order_by('id')
    serializer_class = LessonSerializer

    creator = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class QueueItemViewSet(ModelViewSet):
    """
    API endpoint for viewing queue items
    """
    queryset = QueueItem.objects.all().order_by('rank')
    serializer_class = QueueItemSerializer

    user = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )
    rank = IntegerField(read_only=True, min_value=1, default=1)

    def get_queryset(self):
        return QueueItem.objects.all().filter(
            user=self.request.user,
            rank__isnull=False
        ).order_by('rank')

    def nextRank(self):
        nextRank = 1
        userItems = self.queryset.filter(user=self.request.user)
        maxRank = userItems.aggregate(Max('rank'))['rank__max']

        if maxRank:
            nextRank = maxRank + 1

        return nextRank

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, rank=self.nextRank())

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        QueueItem.objects.renumber(user=self.request.user)
        return Response(status=HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['patch'])
    def up(self, request):
        QueueItem.objects.up(
            userId=self.request.user,
            itemId=self.request.data['item']
            )
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def down(self, request):
        QueueItem.objects.down(
            userId=self.request.user,
            itemId=self.request.data['item']
            )
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)
