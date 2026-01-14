from django.urls import path
from .views import ExamDetailView, ExamSubmitView

urlpatterns = [
    path('<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('<int:pk>/submit/', ExamSubmitView.as_view(), name='exam-submit'),
]
