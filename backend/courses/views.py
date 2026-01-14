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
