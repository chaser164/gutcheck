import random
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
    HTTP_400_BAD_REQUEST,
)
from utilities import HttpOnlyTokenAuthenticationEmailValidated
from rest_framework.permissions import IsAuthenticated

from .models import Post
from .serializers import PostSerializer, PostIDSerializer

class All_posts(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]
    # The alternative: using "if request.user.is_authenticated: ..." for manually deciding which logic require authentication

    def get(self, request):
        allSerializedPosts = PostSerializer(Post.objects.all(), many=True)
        return Response(allSerializedPosts.data)
    
    def post(self, request):
        # Check if the request body appears valid
        if 'text' in request.data and request.data['text'] and 'website' in request.data and request.data['website']:
            new_post = Post(text = request.data['text'], website=request.data['website'], user = request.user)
            # Ensure the fields are valid before saving into the database
            try:
                new_post.full_clean()
            except ValidationError as error:
                return Response({"message": error}, status=HTTP_400_BAD_REQUEST)
            new_post.save()
            return Response(PostSerializer(new_post).data, status=HTTP_201_CREATED)
        else:
            return Response({"message": "Invalid request body"}, status=HTTP_400_BAD_REQUEST)

class Posts_by_website(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]

    # It is unideal to use POST here. I'm doing this because I need to send a body because of the complex parameter (a URL) and get requests don't typically send a body
    def post(self, request):
        posts = Post.objects.filter(website = request.data['website'])
        # Find whether or not the user has posted
        users_who_posted = list(map(lambda post: post.user, posts))
        user_posted = request.user in users_who_posted
        serializedPosts = PostSerializer(posts, many=True)
        return Response({"posts": serializedPosts.data, "user_posted": user_posted})
        
    def delete(self, request):
        # Ensure valid body
        if ('website' in request.data and request.data['website']):
            # If the user is a non-admin, they don't have this power
            if not (request.user.is_staff and request.user.is_superuser):
                return Response({"message": "Admin access only"}, status=HTTP_401_UNAUTHORIZED)
            # Delete all posts
            posts = Post.objects.filter(website = request.data['website'])
            # No posts located here case
            if len(posts.all()) == 0:
                return Response({"message": "No posts to delete here"}, status=HTTP_404_NOT_FOUND)
            for post in posts.all():
                post.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Invalid request body"}, status=HTTP_400_BAD_REQUEST)


class A_post(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]

    def get(self, request, postid, vote=None):
        if vote is not None:
            # The intended endpoint must have been PUT
            return Response({"detail": "Method \"GET\" not allowed."}, status=HTTP_404_NOT_FOUND)
        return Response(PostSerializer(get_object_or_404(Post, id = postid)).data)
    
    def delete(self, request, postid, vote=None):
        if vote is not None:
            # The intended endpoint must have been PUT
            return Response({"detail": "Method \"DELETE\" not allowed."}, status=HTTP_404_NOT_FOUND)
        post = get_object_or_404(Post, id = postid)
        # If the user is deleting their own post or an admin account is logged in...
        if post.user == request.user or (request.user.is_staff and request.user.is_superuser):
            post.delete()
            return Response({"message": "Deleted successfully"}, status=HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Cannot delete others' posts"}, status=HTTP_401_UNAUTHORIZED)
        
    def put(self, request, postid, vote=None):
        if vote is None:
            # The intended endpoint must have been GET or DELETE
            return Response({"detail": "Method \"PUT\" not allowed."}, status=HTTP_404_NOT_FOUND)
        post = get_object_or_404(Post, id = postid)
        if vote == 'upvote':
            post.downvoters.remove(request.user)
            post.upvoters.add(request.user)
            return Response({"message": "Upvoted successfully"}, status=HTTP_204_NO_CONTENT)
        elif vote == 'downvote':
            post.upvoters.remove(request.user)
            post.downvoters.add(request.user)
            return Response({"message": "Downvoted successfully"}, status=HTTP_204_NO_CONTENT)
        elif vote == 'abstain':
            post.downvoters.remove(request.user)
            post.upvoters.remove(request.user)
            return Response({"message": "Abstained successfully"}, status=HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Invalid action"}, status=HTTP_404_NOT_FOUND)
        
class Posts_by_vote(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]

    def get(self, request, up_or_down):
        if up_or_down == 'up':
            # Get a list of id numbers of posts the user has upvoted
            ids = PostIDSerializer(request.user.upvoted_posts, many=True).data
            ids = list(map(lambda x: x['id'], ids))
            return Response(ids)
        elif up_or_down == 'down':
            # Get a list of id numbers of posts the user has downvoted
            ids = PostIDSerializer(request.user.downvoted_posts, many=True).data
            ids = list(map(lambda x: x['id'], ids))
            return Response(ids)
        else:
            return Response({"detail": "Invalid action"}, status=HTTP_404_NOT_FOUND)
        
    
        


       

