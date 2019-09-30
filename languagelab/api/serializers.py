from django.contrib.auth.models import User, Group
from rest_framework.serializers import ModelSerializer
from taggit_serializer.serializers import (
    TagListSerializerField,
    TaggitSerializer
    )

from languagelab.api.models import (
    Exercise, Language, Lesson, MediaItem, QueueItem
    )


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'url', 'username', 'email', 'groups']


class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'url', 'name']


class LanguageSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'code']
        ordering = ['id']


class MediaItemSerializer(TaggitSerializer, ModelSerializer):
    tags = TagListSerializerField()

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
            'isAvailable',
            'isPublic',
            'rights',
            'duration',
            'tags',
            'mediaFile',
            'mediaUrl'
            ]
        ordering = ['-id']

class ExerciseSerializer(ModelSerializer):
    class Meta:
        model = Exercise
        fields = [
            'id',
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
        ordering = ['-id']

class LessonSerializer(TaggitSerializer, ModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = Lesson
        fields = [
            'id',
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
        ordering = ['-id']


class QueueItemSerializer(ModelSerializer):
    class Meta:
        model = QueueItem
        fields = [
            'id',
            'user',
            'exercise',
            'rank',
            'started',
            'completed'
            ]
        ordering = ['-rank']

