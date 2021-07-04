"""

Serializers for LanguageLab Library API

"""
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from rest_framework.serializers import (
    CharField,
    CurrentUserDefault,
    IntegerField,
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField
    )

from rest_framework_jwt.settings import api_settings

from taggit_serializer.serializers import (
    TagListSerializerField,
    TaggitSerializer
    )

from languagelab.api.models import (
    Exercise, Language, Lesson, MediaItem, QueueItem
    )


class UserSerializer(ModelSerializer):
    """

    A serializer to store and retrieve the User model

    """
    class Meta:
        model = get_user_model()
        fields = ['id', 'url', 'username', 'email', 'groups', 'is_staff']

class UserSerializerWithToken(ModelSerializer):
    """

    User serializer including a JWT token for the user

    """

    token = SerializerMethodField()
    password = CharField(write_only=True)

    @staticmethod
    def get_token(obj):
        """

        Retrieve the token associated with the object

        """
        payload = api_settings.JWT_PAYLOAD_HANDLER(obj)
        token = api_settings.JWT_ENCODE_HANDLER(payload)
        return token

    def create(self, validated_data):
        """

        Validate the password if there is none

        """
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)

        instance.save()
        return instance

    class Meta:
        """
        A meta class to specify our model, fields and ordering
        """
        model = get_user_model()
        fields = (
            'id',
            'email',
            'groups',
            'token',
            'url',
            'username',
            'password',
            'is_staff'
        )

class GroupSerializer(ModelSerializer):
    """

    A class to store and retrieve groups

    """
    class Meta:
        model = Group
        fields = ['id', 'url', 'name']


class LanguageSerializer(ModelSerializer):
    """

    Store and retrieve Languages

    """
    class Meta:
        model = Language
        fields = ['id', 'name', 'code']
        ordering = ['id']


class MediaItemSerializer(TaggitSerializer, ModelSerializer):
    """

    Store and retrieve media items

    """
    tags = TagListSerializerField()
    uploader = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )

    class Meta:
        model = MediaItem
        fields = [
            'id',
            'format',
            'name',
            'creator',
            'uploader',
            'language',
            'uploaded',
            'rights',
            'duration',
            'tags',
            'mediaFile',
            'mediaUrl'
            ]
        ordering = ['-id']


class QueueItemSerializer(ModelSerializer):
    """

    Store and retrieve queue items

    """
    rank = IntegerField(read_only=True, min_value=1)

    class Meta:
        """
        A meta class to specify our model, fields and ordering
        """
        model = QueueItem
        fields = [
            'id',
            'lesson',
            'exercise',
            'rank',
            'started',
            'completed'
            ]
        ordering = ['-rank']

class ExerciseSerializer(ModelSerializer):
    """

    Store and retrieve Exercises

    """
    creator = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )
    queueItems = QueueItemSerializer(many=True, read_only=True)

    class Meta:
        """
        A meta class to specify our model, fields and ordering
        """
        model = Exercise
        fields = [
            'id',
            'name',
            'creator',
            'media',
            'dialogue',
            'description',
            'audioOnly',
            'startTime',
            'endTime',
            'notes',
            'created',
            'queueItems'
            ]
        ordering = ['-id']


class LessonSerializer(TaggitSerializer, ModelSerializer):
    """

    Store and retrieve Lessons

    """
    tags = TagListSerializerField()
    queueItems = SerializerMethodField()

    creator = PrimaryKeyRelatedField(
        # set it to read_only as we're handling the writing part ourselves
        read_only=True,
        default=CurrentUserDefault()
    )

    class Meta:
        """
        A meta class to specify our model, fields and ordering
        """
        model = Lesson
        fields = [
            'id',
            'name',
            'created',
            'creator',
            'level',
            'description',
            'notes',
            'queueItems',
            'tags'
            ]
        ordering = ['-id']

    def get_queueItems(self, instance):
        """
        Override get_() to order by rank
        """
        queueItems = instance.queueItems.all().order_by('rank')
        return QueueItemSerializer(queueItems, many=True).data
