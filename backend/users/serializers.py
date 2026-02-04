from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar', 'bio', 'total_score', 'rank', 'level', 'date_joined', 'role')
        read_only_fields = ('total_score', 'rank', 'level', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class PublicUserSerializer(serializers.ModelSerializer):
    certificates = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'avatar', 'bio', 'total_score', 'rank', 'level', 'date_joined', 'certificates')

    def get_certificates(self, obj):
        from results.models import ExamAttempt
        # We need to import the serializer here to avoid circular imports
        from results.serializers import ExamAttemptSerializer
        attempts = ExamAttempt.objects.filter(user=obj, is_passed=True).order_by('-completed_at')
        return ExamAttemptSerializer(attempts, many=True, context=self.context).data
