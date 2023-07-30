#post_app.urls
from django.urls import path
from .views import All_posts, Posts_by_website, A_post

urlpatterns = [
    path("", All_posts.as_view(), name="all_posts"),
    path("bywebsite/", Posts_by_website.as_view(), name="posts_by_website"),
    path("<int:postid>/", A_post.as_view(), name="a_post"),
    path("<int:postid>/<str:vote>/", A_post.as_view(), name="a_post"),
]