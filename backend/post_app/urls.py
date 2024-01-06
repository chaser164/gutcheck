#post_app.urls
from django.urls import path
from .views import All_posts, Posts_by_website, Posts_by_website_no_info, A_post, Posts_by_vote

urlpatterns = [
    path("", All_posts.as_view(), name="all_posts"),
    path("bywebsite/", Posts_by_website.as_view(), name="posts_by_website"),
    path("has-posts/", Posts_by_website_no_info.as_view(), name="posts_by_website_no_info"),
    path("<int:postid>/", A_post.as_view(), name="a_post"),
    path("<int:postid>/<str:vote>/", A_post.as_view(), name="a_post"),
    path("byvote/<str:up_or_down>/", Posts_by_vote.as_view(), name="posts_by_vote")
]