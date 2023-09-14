from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.backends import ModelBackend
from user_app.models import User


class HttpOnlyTokenAuthentication(TokenAuthentication):
    def get_auth_token_from_cookie(self, request):
        # Extract the token from the 'auth_token' HttpOnly cookie
        return request.COOKIES.get('token')

    @staticmethod
    def checkValidated(user):
        return

    def authenticate(self, request):
        # Get the token from the HttpOnly cookie
        auth_token = self.get_auth_token_from_cookie(request)

        if not auth_token:
            # If the token is not found, return None and let other authentication classes handle the authentication
            return None

        # Validate the user
        try:
            user = User.objects.get(auth_token=auth_token)
        except User.DoesNotExist:
            return None
        
        # consider adding a check to ensure the origin is coming from the chrome extension?
        # print('\n\n\nORIGIN:')
        # print(request.META.get('HTTP_ORIGIN', None))
        # print('\n\n\n')
    
        self.checkValidated(user)

        # The original TokenAuthentication class handles token validation and user retrieval
        return self.authenticate_credentials(auth_token)
    

class HttpOnlyTokenAuthenticationEmailValidated(HttpOnlyTokenAuthentication):
    @staticmethod
    def checkValidated(user):
        if not user.validated:
            raise AuthenticationFailed('Unvalidated Email')
        

class CustomAuthenticationBackend(ModelBackend):
    def authenticate(self, request, input, password):
        # Check matching username
        try:
            user = User.objects.get(username=input)
        except User.DoesNotExist:
            # No matching username with the input, so check for matching email
            try:
                user = User.objects.get(email=input)
            except User.DoesNotExist:
                # If we could
                return
                None
        
        if user.check_password(password):
            return user
        return None