#post_app.urls
from django.urls import path
from .views import All_posts, A_post

urlpatterns = [
    path("", All_posts.as_view(), name="all_posts"),
    path("<int:postid>/", A_post.as_view(), name="a_post")
]