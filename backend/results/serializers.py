from rest_framework import serializers
from users.serializers import UserSerializer
from .models import ExamAttempt, CertificateComment, CertificateLike

class CertificateCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CertificateComment
        fields = ('id', 'user', 'text', 'created_at')

class ExamAttemptSerializer(serializers.ModelSerializer):
    exam_title = serializers.ReadOnlyField(source='exam.title')
    course_title = serializers.ReadOnlyField(source='exam.course.title')
    candidate_name = serializers.SerializerMethodField()
    candidate_avatar = serializers.ImageField(source='user.avatar', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    comments = CertificateCommentSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = ExamAttempt
        fields = ('id', 'user_id', 'exam', 'exam_title', 'course_title', 'candidate_name', 'candidate_avatar', 'score', 'earned_points', 'time_taken', 'is_passed', 'completed_at', 'comments', 'likes_count', 'is_liked')
        read_only_fields = ('user', 'completed_at')

    def get_candidate_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name if full_name else obj.user.username

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
