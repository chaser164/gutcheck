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
from utilities import HttpOnlyTokenAuthenticationEmailValidated
from rest_framework.permissions import IsAuthenticated

from .models import Flag
from post_app.models import Post

class Flags(APIView):
    authentication_classes = [HttpOnlyTokenAuthenticationEmailValidated]
    permission_classes = [IsAuthenticated]
    # The alternative: using "if request.user.is_authenticated: ..." for manually deciding which logic require authentication

    def post(self, request):
        post = Post.objects.get(id=request.data['post'])
        # Establish a reason field (if it exists)
        if 'reason' in request.data and request.data['reason']:
            # Ensure text is proper length
            if len(request.data['reason']) > 150:
                return Response({"message": "exceeded 150-character limit"}, status=HTTP_400_BAD_REQUEST)
            else:
                # Create the flag
                Flag.objects.create(reason=request.data['reason'], inaccurate=request.data['inaccurate'], hate_speech=request.data['hate_speech'], explicit_content=request.data['explicit_content'], maliciousURL=request.data['maliciousURL'], user=request.user, post=post)
                return Response(status=HTTP_201_CREATED)
        else:
            # Create the reasonless flag
            Flag.objects.create(inaccurate=request.data['inaccurate'], hate_speech=request.data['hate_speech'], explicit_content=request.data['explicit_content'], maliciousURL=request.data['maliciousURL'], user=request.user, post=post)
            return Response(status=HTTP_201_CREATED)

            