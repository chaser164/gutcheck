from django.db import models
from post_app.models import Post
from user_app.models import User

# Create your models here.

class Flag(models.Model):
    inaccurate = models.BooleanField()
    hate_speech = models.BooleanField()
    explicit_content = models.BooleanField()
    maliciousURL = models.BooleanField()
    reason = models.CharField(max_length=150, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flags')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='flags')