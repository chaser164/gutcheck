import random
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Post
from .serializers import PostSerializer

class All_posts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    # The alternative: using "if request.user.is_authenticated: ..." for manually deciding which logic require authentication

    def get(self, request):
        allSerializedPosts = PostSerializer(Post.objects.all(), many=True).data
        return Response(allSerializedPosts)
    
    def post(self, request):
        # Check if the request body appears valid
        if 'text' in request.data and request.data['text'] and 'website' in request.data and request.data['website']:
            new_post = Post(text = request.data['text'], website=request.data['website'], user = request.user)
            # Ensure the fields are valid before saving into the database
            new_post.full_clean()
            new_post.save()
            return Response(PostSerializer(new_post).data, status=HTTP_201_CREATED)
        else:
            return Response({"message": "Invalid request body"}, status=HTTP_400_BAD_REQUEST)
                   
        
class A_post(APIView):
    authentication_classes = [TokenAuthentication]
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
            return Response({"message": "Invalid URL"}, status=HTTP_404_NOT_FOUND)
        
    
        


       

