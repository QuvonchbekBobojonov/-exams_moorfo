from rest_framework import serializers
from .models import Course, Lesson

class LessonSerializer(serializers.ModelSerializer):
    next_lesson_id = serializers.SerializerMethodField()
    previous_lesson_id = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'

    def get_next_lesson_id(self, obj):
        next_lesson = Lesson.objects.filter(course=obj.course, order__gt=obj.order).order_by('order').first()
        return next_lesson.id if next_lesson else None

    def get_previous_lesson_id(self, obj):
        prev_lesson = Lesson.objects.filter(course=obj.course, order__lt=obj.order).order_by('-order').first()
        return prev_lesson.id if prev_lesson else None

class CourseSerializer(serializers.ModelSerializer):
    lessons_count = serializers.IntegerField(source='lessons.count', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'slug', 'description', 'thumbnail', 'created_at', 'lessons_count', 'category', 'difficulty', 'estimated_duration')

class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    exam_id = serializers.SerializerMethodField()
    total_xp = serializers.SerializerMethodField()
    user_status = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'title', 'slug', 'description', 'thumbnail', 'created_at', 'lessons', 'exam_id', 'category', 'difficulty', 'instructor_name', 'instructor_bio', 'estimated_duration', 'total_xp', 'user_status')

    def get_exam_id(self, obj):
        return obj.exam.id if hasattr(obj, 'exam') else None

    def get_total_xp(self, obj):
        if hasattr(obj, 'exam'):
            from django.db.models import Sum
            return obj.exam.questions.aggregate(total=Sum('points'))['total'] or 0
        return 0

    def get_user_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(obj, 'exam'):
            from results.models import ExamAttempt
            attempt = ExamAttempt.objects.filter(user=request.user, exam=obj.exam, is_passed=True).first()
            if attempt:
                return {'is_passed': True, 'attempt_id': attempt.id, 'score': attempt.score}
        return {'is_passed': False}
