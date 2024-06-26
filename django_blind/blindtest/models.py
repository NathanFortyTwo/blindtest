from django.db import models


from django.db import models


def upload_to(instance, filename):
    # Construct the upload path dynamically
    if instance.room_number:
        return f"music_files/{instance.room_number}/{filename}"
    return f"music_files/{filename}"


class MusicFile(models.Model):
    title = models.CharField(max_length=100)
    room_number = models.CharField(max_length=100, default=None, blank=True, null=True)
    file = models.FileField(upload_to=upload_to)
    play_position = models.IntegerField(default=None, blank=True, null=True)

    def __str__(self):
        return self.title


class Room(models.Model):
    room_number = models.IntegerField()

    def __str__(self):
        return self.room_number


class User(models.Model):
    username = models.CharField(max_length=100)
    room_number = models.IntegerField()
    score = models.IntegerField(default=0)
    is_buzzed = models.BooleanField(default=False)
    can_buzz = models.BooleanField(default=True)

    def __str__(self):
        return self.username
