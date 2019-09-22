from django.contrib.auth.models import User, Group
from rest_framework import serializers
from taggit_serializer.serializers import (
    TagListSerializerField,
    TaggitSerializer
    )

from languagelab.api.models import (
    Exercise, Language, Lesson, MediaItem, QueueItem
    )


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class LanguageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Language
        fields = ['name', 'code']


class MediaItemSerializer(TaggitSerializer, serializers.HyperlinkedModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = MediaItem
        fields = [
            'format',
            'name',
            'creator',
            'uploader',
            'language',
            'uploaded',
            'isAvailable',
            'isPublic',
            'rights',
            'duration',
            'tags',
            'mediaFile',
            'mediaUrl'
            ]


class ExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Exercise
        fields = [
            'name',
            'creator',
            'media',
            'dialogue',
            'description',
            'isAvailable',
            'isPublic',
            'audioOnly',
            'startTime',
            'endTime',
            'notes',
            'created'
            ]

class LessonSerializer(TaggitSerializer, serializers.HyperlinkedModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = Lesson
        fields = [
            'name',
            'creator',
            'level',
            'exercises',
            'isAvailable',
            'isPublic',
            'description',
            'notes',
            'tags',
            'created'
            ]

class QueueItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = QueueItem
        fields = [
            'user',
            'exercise',
            'rank',
            'started',
            'completed'
            ]

