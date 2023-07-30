from django.db import models
from user_app.models import User

# Create your models here.
class Post(models.Model):
    text = models.CharField(max_length=150)
    website = models.URLField()
    datetime = models.DateTimeField(auto_now_add=True) # Adds datetime at time of post creation
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    upvoters = models.ManyToManyField(User, related_name='upvoted_posts')
    downvoters = models.ManyToManyField(User, related_name='downvoted_posts')
   

