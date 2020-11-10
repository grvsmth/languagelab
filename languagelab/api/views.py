"""

Views for the Language Lab REST API

"""
from logging import basicConfig, getLogger

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
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

from languagelab.api.iso639client import get_iso639, make_language
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
    queryset = get_user_model().objects.all().order_by('-date_joined')
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

    @staticmethod
    @action(detail=False, methods=['post'])
    def update_all(request):
        """
        Update all the languages from the source
        """
        counter = 0
        res = get_iso639()

        for entry in res:
            language = make_language(entry)
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

    def destroy(self, request):
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
        """

        Retrieve a filtered querySet for the queue items

        """
        return QueueItem.objects.all().filter(
            user=self.request.user,
            rank__isnull=False
        ).order_by('rank')

    def next_rank(self):
        """

        If we want to add an item to the end of the queue, what rank would it
        have?

        """
        next_rank = 1
        user_items = self.queryset.filter(user=self.request.user)
        max_rank = user_items.aggregate(Max('rank'))['rank__max']

        if max_rank:
            next_rank = max_rank + 1

        return next_rank

    def perform_create(self, serializer):
        """

        Override default perform_create with next_rank()

        """
        serializer.save(user=self.request.user, rank=self.next_rank())

    def destroy(self, request):
        """

        Override default destroy method, renumbering the queue items

        """
        self.perform_destroy(self.get_object())
        QueueItem.objects.renumber(user=self.request.user)
        return Response(status=HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['patch'])
    def up(self, request):
        """

        Move the item up in the rank list by calling the .up() method

        """
        QueueItem.objects.up(
            user_id=self.request.user,
            item_id=self.request.data['item']
            )
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def down(self, request):
        """

        Move the item down in the rank list by calling the .down() method

        """
        QueueItem.objects.down(
            user_id=self.request.user,
            item_id=self.request.data['item']
            )
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)