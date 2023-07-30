from django.db import models
from user_app.models import User
from django.core.exceptions import ValidationError

# Create your models here.
class Post(models.Model):
    text = models.CharField(max_length=150)
    website = models.URLField()
    datetime = models.DateTimeField(auto_now_add=True) # Adds datetime at time of post creation
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    upvoters = models.ManyToManyField(User, related_name='upvoted_posts')
    downvoters = models.ManyToManyField(User, related_name='downvoted_posts')

    # Only allow a user to post about a particular website once
    def clean(self):
        websites = [post.website for post in self.user.posts.all()]
        if self.website in websites:
            raise ValidationError('User already posted about this website')
   

