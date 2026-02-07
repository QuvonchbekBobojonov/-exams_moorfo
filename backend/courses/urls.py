from django.urls import path
from .views import (
    CourseListView, CourseDetailView, LessonDetailView, 
    CourseCompletersView, AdminCourseListView, AdminCourseDetailView,
    AdminLessonListView, AdminLessonDetailView
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<slug:slug>/completers/', CourseCompletersView.as_view(), name='course-completers'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    
    # Management
    path('admin/manage/', AdminCourseListView.as_view(), name='admin-course-list'),
    path('admin/manage/<int:pk>/', AdminCourseDetailView.as_view(), name='admin-course-detail'),
    path('admin/manage/<int:course_pk>/lessons/', AdminLessonListView.as_view(), name='admin-lesson-list'),
    path('admin/manage/lessons/<int:pk>/', AdminLessonDetailView.as_view(), name='admin-lesson-detail'),
]
