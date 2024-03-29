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
from django.db import IntegrityError
from django.utils.http import http_date
from rest_framework.authtoken.models import Token
# from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from utilities import HttpOnlyTokenAuthentication, HttpOnlyTokenAuthenticationEmailValidated
from django.core.exceptions import ValidationError
from .models import User
from .serializers import UserSerializer


class Sign_up(APIView):

    def post(self, request):
        # Permanently banned emails must not be allowed to sign up
        # Open the file in read mode
        with open('user_app/banned_emails.txt', 'r') as file:
            # Read all lines from the file and store them in a list
            BANNED_EMAILS = file.readlines()
            BANNED_EMAILS_STRIPPED = [email.strip() for email in BANNED_EMAILS]
        if request.data['email'] in BANNED_EMAILS_STRIPPED:
            return Response({"message": "Disallowed email"}, status=HTTP_400_BAD_REQUEST)
        # Attempt to create user
        try:
            user = User.objects.create_user(**request.data)
        except IntegrityError as e:
            # Ensure uniqueness, return error messages otherwise
            if 'unique constraint' in str(e).lower():
                # Handle integrity constraint violations
                if 'email' in str(e).lower():
                    return Response({"message": "Email already registered"}, status=HTTP_400_BAD_REQUEST)
                elif 'username' in str(e).lower():
                    return Response({"message": "Username already in use"}, status=HTTP_400_BAD_REQUEST)
            else:
                # Handle other integrity errors (I doubt this would ever be triggered, but extra safe to have this)
                return Response({"message": "Integrity error occurred"}, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle other exceptions
            print(e)
            return Response({"message": "Could not create user"}, status=HTTP_400_BAD_REQUEST)
        # Check that email is valid, if not, delete the created user
        try:
            user.full_clean()
        except ValidationError as e:
            user.delete()
            return Response({"message": "Improper email format"}, status=HTTP_400_BAD_REQUEST)

        # Validate email
        user.send_validation_email()
        # In case of unsuccessful email send...
        token, _ = Token.objects.get_or_create(user=user)
        life_time = datetime.now() + timedelta(days=365*30)
        format_life_time = http_date(life_time.timestamp())
        response = Response({"user": user.username, 'receives_alerts': user.receives_alerts})
        response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite='Strict', expires=format_life_time)
        return response
    
class Log_in(APIView):

    def post(self, request):
        input = request.data.get("input")
        password = request.data.get("password")
        user = authenticate(input=input, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            life_time = datetime.now() + timedelta(days=365*30)
            format_life_time = http_date(life_time.timestamp())
            response = Response({"user": user.username, 'receives_alerts': user.receives_alerts})
            response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite='Strict', expires=format_life_time)
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

# class Admin_sign_up(APIView):
#     # MAKE THIS A MORE SECURE PAGE...(some key that changes every day)

#     def post(self, request):
#         request.data["username"] = request.data["email"]
#         # Try to create a user, the creation will not occur if the email is already being used
#         try:
#             admin_user = User.objects.create_user(**request.data)
#         except:
#             return Response({"message": "Email already in use for another account"}, status=HTTP_400_BAD_REQUEST)
#         # Check that email is valid, if not, delete the created user
#         try:
#             admin_user.full_clean()
#         except:
#             admin_user.delete()
#             return Response({"message": "Improper email format"}, status=HTTP_400_BAD_REQUEST)
#         admin_user.is_staff = True
#         admin_user.is_superuser = True
#         # Validate email and create token
#         admin_user.send_validation_email()
#         token, _ = Token.objects.get_or_create(user=admin_user)
#         life_time = datetime.now() + timedelta(days=7)
#         format_life_time = http_date(life_time.timestamp())
#         response = Response({"user": admin_user.email})
#         response.set_cookie(key="token", value=token.key, httponly=True, secure=True, samesite='Strict', expires=format_life_time)
#         return response

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
    def delete(self, request, userid=None):
        if request.user.is_staff and request.user.is_superuser:
            user = get_object_or_404(User, id = userid)
            if user == request.user:
                user.auth_token.delete()
                response = Response(status=HTTP_204_NO_CONTENT)
                response.delete_cookie("token")
                user.delete()
                return response
            if user.is_staff and user.is_superuser:
                return Response({"message": "Cannot delete other admins"}, status=HTTP_401_UNAUTHORIZED)
            else:
                user.auth_token.delete()
                response = Response(status=HTTP_204_NO_CONTENT)
                response.delete_cookie("token")
                user.delete()
                return response
        # Allow self deletion
        elif userid is None or userid == request.user.id:
            request.user.auth_token.delete()
            response = Response(status=HTTP_204_NO_CONTENT)
            response.delete_cookie("token")
            request.user.delete()
            return response
        else:
            return Response({"message": "Admin access only"}, status=HTTP_401_UNAUTHORIZED)
        
class User_status(APIView):
    authentication_classes = [HttpOnlyTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"email": request.user.email, "user": request.user.username, "is_validated": request.user.validated, 'receives_alerts': request.user.receives_alerts})
    
    def delete(self, request):
        request.user.auth_token.delete()
        response = Response(status=HTTP_204_NO_CONTENT)
        response.delete_cookie("token")
        request.user.delete()
        return response
    

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
                # Invalidate all tokens associated with current logged in users (if any)
                try:
                    Token.objects.filter(user=user).delete()
                except:
                    pass
                return Response({"message": "Password updated!"})
            else:
                return Response({"message": "Expired link, password not updated"})
        except Exception as e:
            print("An error occurred:", e)
            # User not found
            return Response({"message": "Invalid link, password not updated"})


class Alerts(APIView):
    authentication_classes = [HttpOnlyTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        request.user.receives_alerts = request.data['alerts']
        request.user.save()
        return Response(status=HTTP_204_NO_CONTENT)
        