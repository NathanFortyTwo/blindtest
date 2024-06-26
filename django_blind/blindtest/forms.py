from django import forms


class MultiMusicFileForm(forms.Form):
    files = forms.FileField()


class JoinaRoomForm(forms.Form):
    room_number = forms.CharField()
    user_name = forms.CharField()
