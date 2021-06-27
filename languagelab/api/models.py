"""

Models for LanguageLab Library

"""
from datetime import timedelta
from logging import basicConfig, getLogger

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
    Model,
    TextField
    )
from django.utils.timezone import now

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
    description = CharField("Instructions", max_length=1000, blank=True)
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
    level = IntegerField("Level", db_index=True, default=0)
    description = TextField("Instructions", blank=True)
    notes = TextField("Notes", null=True, blank=True)
    tags = TaggableManager()
    created = DateTimeField("Created", auto_now_add=True)


class QueueManager (Manager):
    """
    Manager for queue operations
    """
    def lesson_queue(self, lesson_id):
        """

        Get the queue filtered for a specific lesson

        """
        return super().get_queryset().filter(
            lesson=lesson_id,
            rank__isnull=False
        ).order_by('rank')

    def renumber(self, lesson_id):
        """

        Renumber the queue items for a given lesson

        """
        i = 1
        queue = self.lesson_queue(lesson_id)
        for queue_item in queue:
            if queue_item.completed is None:
                queue_item.rank = i
                queue_item.save()
                i += 1

    def delete_by_exercise(self, exercise_id):
        """
        Delete all queueItems with a given exercise and renumber the queue
        """

        queue_items = super().get_queryset().filter(exercise=exercise_id)

        for queue_item in queue_items:
            lesson_id = queue_item.lesson
            queue_item.delete()
            self.renumber(lesson_id)

    @staticmethod
    def is_unmovable(queue, old_rank, direction):
        """
        If moving up (by decreasing the numerical rank), is it rank 1?
        If moving down (by increasing the numerical rank), is it the top rank?
        Is it out of bounds?
        """
        if direction == "up":
            return old_rank < 2 or old_rank > queue.count()

        return old_rank < 1 or old_rank >= queue.count()

    @staticmethod
    def new_rank(old_rank, direction):
        """
        If moving up in the queue, DECREASE the numerical rank
        If moving down, INCREASE the numerical rank
        """
        if direction == "up":
            return old_rank - 1

        return old_rank + 1

    def move(self, item_id, direction):
        """
        Move the current item in the ranking, if it is movable
        """
        item = super().get_queryset().get(id=item_id)
        queue = self.lesson_queue(item.lesson.id)
        old_rank = item.rank

        if self.is_unmovable(queue, old_rank, direction):
            return queue

        new_rank = self.new_rank(old_rank, direction)

        """
        If the new rank was previously assigned to another item, this item
        switches ranks with it
        """
        queue.filter(rank=new_rank).update(rank=old_rank)
        queue.filter(id=item_id).update(rank=new_rank)

        return queue


class QueueItem (Model):
    """
    Model for tracking exercises in a lesson queue
    """
    lesson = ForeignKey(
        Lesson,
        verbose_name="lesson",
        related_name="queueItems",
        on_delete=CASCADE,
        blank=True
    )
    exercise = ForeignKey(
        Exercise,
        verbose_name="exercise",
        related_name="queueItems",
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
