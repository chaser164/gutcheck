#post_app.urls
from django.urls import path
from .views import Flags

urlpatterns = [
    path("", Flags.as_view(), name="flags"),
]