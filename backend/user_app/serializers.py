from rest_framework import serializers
from .models import User
from post_app.serializers import PostSerializer

class UserSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField()
    posts = PostSerializer(many=True)
      
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'validated', 'admin', 'posts']

    def get_admin(self, instance):
        return instance.is_staff and instance.is_superuser
