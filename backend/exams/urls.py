from django.urls import path
from .views import ExamDetailView, ExamSubmitView, AdminExamListView, AdminExamDetailView

urlpatterns = [
    path('<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('<int:pk>/submit/', ExamSubmitView.as_view(), name='exam-submit'),
    # Management
    path('admin/', AdminExamListView.as_view(), name='admin-exam-list'),
    path('admin/<int:pk>/', AdminExamDetailView.as_view(), name='admin-exam-detail'),
]
