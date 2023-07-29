#user_app.views
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer


class Sign_up(APIView):
    
    def post(self, request):
        request.data["username"] = request.data["email"]
        # Try to create a user, the creation will not occur if the email is already being used
        try:
            user = User.objects.create_user(**request.data)
        except:
            return Response({"message": "Email already in use for another account"}, status=HTTP_400_BAD_REQUEST)
        # Check that email is valid, if not, delete the created user
        try:
            user.full_clean()
        except:
            user.delete()
            return Response({"message": "Improper email format"}, status=HTTP_400_BAD_REQUEST)

        # Validate email
        user.send_validation_email()
        # Don't give a token on signup...
        return Response(
            {"admin_email": user.email, "message": "Check email to activate your account."}, status=HTTP_201_CREATED
        )
    
class Log_in(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password, valitation_info='validated')
        if user:
            if not user.validation_info == 'validated':
                return Response({"message": "Unvalidated email address"}, status=HTTP_401_UNAUTHORIZED)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": user.email})
        else:
            return Response({"message": "No user matching credentials"}, status=HTTP_404_NOT_FOUND)

class Log_out(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=HTTP_204_NO_CONTENT)

class Admin_sign_up(APIView):
    # MAKE THIS A MORE SECURE PAGE...(some key that changes every day)

    def post(self, request):
        request.data["username"] = request.data["email"]
        # Try to create a user, the creation will not occur if the email is already being used
        try:
            admin_user = User.objects.create_user(**request.data)
        except:
            return Response({"message": "Email already in use for another account"}, status=HTTP_400_BAD_REQUEST)
        # Check that email is valid, if not, delete the created user
        try:
            admin_user.full_clean()
        except:
            admin_user.delete()
            return Response({"message": "Improper email format"}, status=HTTP_400_BAD_REQUEST)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        # Validate email
        admin_user.send_validation_email()
        # Don't give a token on signup...
        return Response(
            {"admin_email": admin_user.email, "message": "Check email to activate your account."}, status=HTTP_201_CREATED
        )

class All_users(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

     # Only admins (users that are both staff and superusers) may view the master list of all users
    def get(self, request):
        if request.user.is_staff and request.user.is_superuser:
            return Response(UserSerializer(User.objects.all(), many=True).data)
        else:
            return Response({"message": "Admin access only"}, status=HTTP_401_UNAUTHORIZED)
        
class A_user(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, userid=None):
        if userid is not None:
            user = get_object_or_404(User, id = userid)
            return Response(UserSerializer(user).data)
        else:
            # Accessing your own info with "me" endpoint
            return Response(UserSerializer(request.user).data)
        
    # Only admins (users that are both staff and superusers) may delete other users
    def delete(self, request, userid):
        if request.user.is_staff and request.user.is_superuser:
            user = get_object_or_404(User, id = userid)
            if user == request.user:
                return Response({"message": "Cannot delete yourself"}, status=HTTP_401_UNAUTHORIZED)
            if user.is_staff and user.is_superuser:
                return Response({"message": "Cannot delete other admins"}, status=HTTP_401_UNAUTHORIZED)
            else:
                user.delete()
                return Response(status=HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Admin access only"}, status=HTTP_401_UNAUTHORIZED)
        

class Validation(APIView):
    # just do objects.get ...
    def get(self, request, validation_key):
        try: 
            user = User.objects.get(validation_info = User.hash(validation_key))
            user.validation_info = 'validated'
            user.save()
            return Response({"message": "Account activated"})
        except:
            # User not found
            return Response({"message": "Invalid link"})