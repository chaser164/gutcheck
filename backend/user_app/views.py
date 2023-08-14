#user_app.views
from datetime import datetime, timedelta
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
from django.utils.http import http_date
from rest_framework.authtoken.models import Token
# from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from utilities import HttpOnlyTokenAuthentication, HttpOnlyTokenAuthenticationEmailValidated

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
        # In case of unsuccessful email send...
        token, _ = Token.objects.get_or_create(user=user)
        life_time = datetime.now() + timedelta(days=7)
        format_life_time = http_date(life_time.timestamp())
        response = Response({"user": user.email})
        response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite='None', expires=format_life_time)
        return response
        # Response({"user": user.email})
    
class Log_in(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            life_time = datetime.now() + timedelta(days=7)
            format_life_time = http_date(life_time.timestamp())
            response = Response({"user": user.email})
            response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite='None', expires=format_life_time)
            return response
        else:
            return Response({"message": "No user matching credentials"}, status=HTTP_404_NOT_FOUND)

class Log_out(APIView):
    authentication_classes = [HttpOnlyTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        response = Response(status=HTTP_204_NO_CONTENT)
        response.delete_cookie("token")
        return response

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
        # Validate email and create token
        admin_user.send_validation_email()
        token, _ = Token.objects.get_or_create(user=admin_user)
        life_time = datetime.now() + timedelta(days=7)
        format_life_time = http_date(life_time.timestamp())
        response = Response({"user": admin_user.email})
        response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite='None', expires=format_life_time)
        return response

class All_users(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]

     # Only admins (users that are both staff and superusers) may view the master list of all users
    def get(self, request):
        if request.user.is_staff and request.user.is_superuser:
            return Response(UserSerializer(User.objects.all(), many=True).data)
        else:
            return Response({"message": "Admin access only"}, status=HTTP_401_UNAUTHORIZED)
        
class A_user(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]

    def get(self, request, userid=None):
        if userid is not None:
            user = get_object_or_404(User, id = userid)
            # If the user is viewing themself or an admin is accessing the endpoint...
            if userid == request.user.id or (request.user.is_staff and request.user.is_superuser):
                return Response(UserSerializer(user).data)
            else:
                return Response({"message": "Admin access only"}, status=HTTP_401_UNAUTHORIZED)
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
        
class User_status(APIView):
    authentication_classes = [HttpOnlyTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"email": request.user.email, "is_validated": request.user.validated})
    

class Resend_email(APIView):
    authentication_classes = [HttpOnlyTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.user.send_validation_email()
        return Response({"message": message})

        
class Validation(APIView):
    # just do objects.get ...
    def put(self, request, validation_key):
        try: 
            user = User.objects.get(validation_or_reset_tokens = User.hash(validation_key))
            if not user.is_expired():
                user.validation_or_reset_tokens = ''
                user.validated = True
                user.save()
                return Response({"message": "Account activated"})
            else:
                return Response({"message": "Expired link"})
        except:
            # User not found
            return Response({"message": "Invalid link"})
        

class Send_password_email(APIView):
    def post(self, request):
        user = get_object_or_404(User, email=request.data['email'])
        message = user.send_reset_email()
        return Response({"message": message})
    

class Password_reset(APIView):
    def put(self, request, reset_key):
        try: 
            user = User.objects.get(validation_or_reset_tokens = User.hash(reset_key))
            if not user.is_expired():
                user.set_password(request.data['password'])

                user.validation_or_reset_tokens = ''
                user.validated = True
                user.save()
                return Response({"message": "Password updated!"})
            else:
                return Response({"message": "Expired link, password not updated"})
        except:
            # User not found
            return Response({"message": "Invalid link, password not updated"})
