from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField()
      
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'validation_info', 'admin']

    def get_admin(self, instance):
        return instance.is_staff and instance.is_superuser
