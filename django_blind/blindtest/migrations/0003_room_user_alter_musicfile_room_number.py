# Generated by Django 5.0.6 on 2024-06-15 09:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("blindtest", "0002_musicfile_play_position_musicfile_room_number"),
    ]

    operations = [
        migrations.CreateModel(
            name="Room",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("room_number", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=100)),
                ("room_number", models.IntegerField()),
                ("score", models.IntegerField(default=0)),
                ("is_buzzed", models.BooleanField(default=False)),
                ("can_buzz", models.BooleanField(default=True)),
            ],
        ),
        migrations.AlterField(
            model_name="musicfile",
            name="room_number",
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
    ]
