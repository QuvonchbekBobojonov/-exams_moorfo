from rest_framework import generics, permissions
from .models import ExamAttempt
from .serializers import ExamAttemptSerializer

class UserExamAttemptListView(generics.ListAPIView):
    serializer_class = ExamAttemptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return ExamAttempt.objects.filter(user=self.request.user).order_by('-completed_at')
