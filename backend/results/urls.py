from django.urls import path
from .views import UserExamAttemptListView

urlpatterns = [
    path('history/', UserExamAttemptListView.as_view(), name='exam-history'),
]
