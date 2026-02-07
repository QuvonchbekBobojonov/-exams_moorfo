from rest_framework import generics, permissions
from .models import Course, Lesson
from .serializers import CourseSerializer, CourseDetailSerializer, LessonSerializer

class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = Course.objects.all()
        category = self.request.query_params.get('category')
        difficulty = self.request.query_params.get('difficulty')
        
        if category:
            queryset = queryset.filter(category=category)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
            
        return queryset

class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    lookup_field = 'slug'
    permission_classes = (permissions.AllowAny,)

class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = (permissions.IsAuthenticated,)

class CourseCompletersView(generics.ListAPIView):
    # Import locally to avoid circular dependencies if any, though likely fine at top if careful.
    # But usually views don't cause circular imports with serializers unless view imports serializer which imports view's app model...
    permission_classes = (permissions.AllowAny,)
    
    def get_serializer_class(self):
        from results.serializers import ExamAttemptSerializer
        return ExamAttemptSerializer

    def get_queryset(self):
        from results.models import ExamAttempt
        slug = self.kwargs['slug']
        return ExamAttempt.objects.filter(exam__course__slug=slug, is_passed=True).order_by('-score', '-completed_at')[:20]
# Management Admin Views
class AdminCourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAdminUser,)

class AdminCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'pk'
    permission_classes = (permissions.IsAdminUser,)

class AdminLessonListView(generics.ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['course_pk'])

class AdminLessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = (permissions.IsAdminUser,)
