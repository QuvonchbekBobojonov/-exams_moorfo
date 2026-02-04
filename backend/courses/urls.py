from django.urls import path
from .views import CourseListView, CourseDetailView, LessonDetailView, CourseCompletersView

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<slug:slug>/completers/', CourseCompletersView.as_view(), name='course-completers'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
]
