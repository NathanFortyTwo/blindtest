from django.shortcuts import render, redirect
from .forms import MultiMusicFileForm, JoinaRoomForm
from .models import MusicFile
import uuid
import urllib.parse
import re
import os
import pickle


def home(request):
    if request.session.session_key is None:
        request.session.create()
    return render(request, "home.html")


def create_room(request):
    if request.method == "POST":
        form = MultiMusicFileForm(request.POST, request.FILES)
        files = request.FILES.getlist("files")
        if form.is_valid():
            request.session["admin"] = True
            print(request.POST["user_name"])
            request.session["user_name"] = request.POST["user_name"]
            request.session.save()
            print(request.session["user_name"])
            print(list(form.cleaned_data.keys()))
            for f in files:
                MusicFile.objects.create(
                    file=f,
                    title=f.name,
                    room_number=request.session["room_number"],
                    play_position=0,
                )
            return redirect(f"/rooms/{request.session['room_number']}")

    if request.method == "GET":
        int_room_code = str(uuid.uuid4().int)[:6]
        request.session["room_number"] = int_room_code
        form = MultiMusicFileForm()

    return render(
        request,
        "create-room.html",
        {
            "form": form,
            "session_id": request.session.session_key,
            "user_name": request.session["user_name"],
        },
    )


def join_room(request):
    if request.method == "POST":
        form = JoinaRoomForm(request.POST)
        request.session["room_number"] = request.POST[("room_number")]
        request.session["user_name"] = request.POST[("user_name")]
        request.session.save()
        return redirect(f"/rooms/{request.session['room_number']}")

    if request.method == "GET":
        form = JoinaRoomForm()
        if request.session.session_key:
            request.session.flush()
        return render(request, "join_room.html", {"form": form})


def room(request, room_number):
    try:
        admin = request.session["admin"]
    except KeyError:
        admin = False
    files = MusicFile.objects.filter(room_number=room_number)

    if not files:
        return redirect("/")

    return render(
        request,
        "room.html",
        {
            "room_number": room_number,
            "username": request.session["user_name"],
            "files": files,
            "admin": admin,
        },
    )


RANGE_RE = re.compile(r"bytes\s*=\s*(\d+)\s*-\s*(\d*)", re.I)


def file_iterator(file_path, chunk_size=8192, offset=0, length=None):
    with open(file_path, "rb") as f:
        f.seek(offset, os.SEEK_SET)
        remaining = length
        while True:
            bytes_length = (
                chunk_size if remaining is None else min(remaining, chunk_size)
            )
            data = f.read(bytes_length)
            if not data:
                break
            if remaining:
                remaining -= len(data)
            yield data


def audio2(request):
    return render(request, "audio.html")
