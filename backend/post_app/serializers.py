from rest_framework import serializers
from .models import Post
from flag_app.models import Flag

class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    upvotes = serializers.SerializerMethodField()
    downvotes = serializers.SerializerMethodField()
    flagged = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'username', 'text', 'website', 'datetime', 'upvotes', 'downvotes', 'footnote1', 'explanation1', 'footnote2', 'explanation2', 'flagged']

    def get_username(self, instance):
        return instance.user.username

    def get_upvotes(self, instance):
        return instance.upvoters.count()

    def get_downvotes(self, instance):
        return instance.downvoters.count()
    
    def get_flagged(self, instance):
        posts_flagged_by_user = self.context.get("posts_flagged_by_user")
        # True if the user has already flagged this post, false otherwise
        return instance.id in posts_flagged_by_user


class PostIDSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['id']





