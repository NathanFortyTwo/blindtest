from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from blindtest import views

urlpatterns = [
    path("", views.home),
    path("join/", views.join_room, name="join_room"),
    path("create/", views.create_room, name="create"),
    path("rooms/<int:room_number>/", views.room, name="room"),
    path("api/delete_files/", views.delete_files, name="delete_files"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
