# Generated by Django 5.0.6 on 2024-07-13 14:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("blindtest", "0005_alter_musicfile_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="room",
            name="room_number",
            field=models.CharField(max_length=100),
        ),
    ]
