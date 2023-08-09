from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from user_app.models import User


class HttpOnlyTokenAuthentication(TokenAuthentication):
    def get_auth_token_from_cookie(self, request):
        # Extract the token from the 'auth_token' HttpOnly cookie
        print(f"cookie: {request.COOKIES.get('token')}")
        return request.COOKIES.get('token')

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
        
        if user.validation_info != 'validated':
            raise AuthenticationFailed('Unvalidated Email')

        # The original TokenAuthentication class handles token validation and user retrieval
        return self.authenticate_credentials(auth_token)