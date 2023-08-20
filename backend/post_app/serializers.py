from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    upvotes = serializers.SerializerMethodField()
    downvotes = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'username', 'text', 'website', 'datetime', 'upvotes', 'downvotes']

    def get_username(self, instance):
        return instance.user.username

    def get_upvotes(self, instance):
        return instance.upvoters.count()

    def get_downvotes(self, instance):
        return instance.downvoters.count()


class PostIDSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['id']





