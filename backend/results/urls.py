from django.urls import path
from .views import (
    UserExamAttemptListView, ExamAttemptDetailView, 
    CertificateCommentListCreateView, CertificateLikeToggleView
)

urlpatterns = [
    path('history/', UserExamAttemptListView.as_view(), name='exam-history'),
    path('attempts/<int:pk>/', ExamAttemptDetailView.as_view(), name='attempt-detail'),
    path('attempts/<int:pk>/comments/', CertificateCommentListCreateView.as_view(), name='attempt-comments'),
    path('attempts/<int:pk>/like/', CertificateLikeToggleView.as_view(), name='attempt-like'),
]
