from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'text', 'datetime', 'user']

    def get_user(self, instance):
        return instance.user.username


