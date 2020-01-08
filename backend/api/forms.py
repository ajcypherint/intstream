# users/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import UserIntStream

class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = UserIntStream
        fields = ('username', 'email',"is_staff","is_integrator","is_superuser","organization")


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = UserIntStream
        fields = ('username', 'email',"is_staff","is_integrator","is_superuser","organization")