from rest_framework import serializers
from .models import ExamAttempt

class ExamAttemptSerializer(serializers.ModelSerializer):
    exam_title = serializers.ReadOnlyField(source='exam.title')

    class Meta:
        model = ExamAttempt
        fields = ('id', 'exam', 'exam_title', 'score', 'time_taken', 'is_passed', 'completed_at')
        read_only_fields = ('user', 'completed_at')
