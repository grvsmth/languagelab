from django.db.models import (
    CharField,
    Model,
    )


class Language(Model):
    """

    This model is for storing languages; we use ISO 639-3 for codes

    """
    name = CharField("Name", max_length=100)
    code = CharField("Code", max_length=10)

    def __str__(self):
        return self.name
