#! /bin/bash
node jsaudio/server.js &
# cd django_blind && gunicorn --bind 0.0.0.0:8000 django_blind.wsgi:application 
cd django_blind && python3 manage.py runserver 0.0.0.0:8000