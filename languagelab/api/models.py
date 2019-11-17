from datetime import timedelta

from django.conf import settings
from django.db.models import (
    CASCADE,
    BooleanField,
    CharField,
    DateTimeField,
    DurationField,
    FileField,
    ForeignKey,
    IntegerField,
    Manager,
    ManyToManyField,
    Model,
    TextField
    )
from django.utils.timezone import now

from logging import basicConfig, getLogger

from taggit.managers import TaggableManager

LOG = getLogger()
basicConfig(level="DEBUG")


class Language(Model):
    """

    This model is for storing languages; we use ISO 639-3 for codes

    """
    name = CharField("Name", max_length=100)
    code = CharField("Code", max_length=10)

    def __str__(self):
        return self.name


class MediaItem(Model):
    """
    Model for storing metadata about media that are either uploaded or
    linked for languagelab exercises
    """
    format_choices = (('au', 'Audio'), ('vi', 'Video'))
    format = CharField(max_length=2, choices=format_choices, default='au')

    name = CharField("Name", max_length=100)
    creator = CharField("Creator", db_index=True, max_length=40)
    rights = CharField("Rights", max_length=20, db_index=True)

    uploaded = DateTimeField("Uploaded", default=now)
    duration = DurationField("Duration", default=timedelta())

    isAvailable = BooleanField("Available", db_index=True)
    isPublic = BooleanField("Public", db_index=True)

    tags = TaggableManager()
    mediaFile = FileField(
        "File", upload_to='uploads/', null=True, blank=True
    )
    mediaUrl = CharField(
        "Remote URL", max_length=2083, null=True, blank=True
    )

    uploader = ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="uploader",
        on_delete=CASCADE
    )

    language = ForeignKey(
        Language,
        verbose_name="language",
        on_delete=CASCADE
    )


class Exercise (Model):
    """
    Model for storing exercises
    """
    name = CharField("Name", max_length=100, db_index=True)
    creator = ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="creator",
        on_delete=CASCADE
    )
    media = ForeignKey(
        MediaItem,
        verbose_name="media",
        on_delete=CASCADE
    )

    dialogue = BooleanField("Dialogue", db_index=True, default=False)
    description = CharField("Instructions", max_length=1000)
    isAvailable = BooleanField("Available", db_index=True)
    isPublic = BooleanField("Public", db_index=True)
    audioOnly = BooleanField("Audio only", db_index=True, default=True)
    startTime = DurationField("Start time", default=timedelta())
    endTime = DurationField("End time", default=timedelta())
    notes = TextField("Notes", null=True, blank=True)
    created = DateTimeField("Created", default=now)


class Lesson (Model):
    """
    Model for storing lessons
    """
    name = CharField("Name", max_length=100, db_index=True)
    creator = ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="creator",
        on_delete=CASCADE
    )
    level = IntegerField("Level", db_index=True)
    exercises = ManyToManyField(Exercise, verbose_name="exercises")
    isAvailable = BooleanField("Available", db_index=True)
    isPublic = BooleanField("Public", db_index=True)
    description = TextField("Instructions")
    notes = TextField("Notes", null=True, blank=True)
    tags = TaggableManager()
    created = DateTimeField("Created", auto_now_add=True)


class QueueManager (Manager):
    """
    Manager for queue operations
    """
    def userQueue(self, userId):
        return super(
            QueueManager,
            self
        ).get_queryset().filter(
            user=userId,
            rank__isnull=False
        ).order_by('rank')

    def renumber(self, user):
        i = 1
        queue = self.userQueue(user)
        for (queueItem) in queue:
            if (queueItem.completed is None):
                queueItem.rank = i
                queueItem.save()
                i += 1

    def up(self, userId, itemId):
        queue = self.userQueue(userId)
        item = queue.get(id=itemId)

        if item.rank < 2 or item.rank > queue.count():
            return item.rank

        newrank = item.rank - 1
        oldQueueItem = queue.get(rank=newrank, user=userId)
        oldQueueItem.rank = item.rank
        item.rank = newrank
        oldQueueItem.save()
        item.save()

        return queue


class QueueItem (Model):
    """
    Model for tracking exercises in a user queue
    """
    user = ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="user",
        on_delete=CASCADE
    )
    exercise = ForeignKey(
        Exercise,
        verbose_name="exercise",
        on_delete=CASCADE
    )
    rank = IntegerField(
        "Rank",
        db_index=True
    )
    started = DateTimeField(
        "Started",
        null=True,
        blank=True,
        db_index=True
    )
    completed = DateTimeField("Completed", null=True, blank=True)

    objects = QueueManager()
