# Generated by Django 5.0.6 on 2024-06-16 15:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("blindtest", "0003_room_user_alter_musicfile_room_number"),
    ]

    operations = [
        migrations.AlterField(
            model_name="musicfile",
            name="file",
            field=models.FileField(
                upload_to="music_files/<django.db.models.fields.CharField>"
            ),
        ),
    ]
