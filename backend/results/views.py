from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from .models import ExamAttempt, CertificateComment, CertificateLike
from .serializers import ExamAttemptSerializer, CertificateCommentSerializer

class UserExamAttemptListView(generics.ListAPIView):
    serializer_class = ExamAttemptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return ExamAttempt.objects.filter(user=self.request.user).order_by('-completed_at')

class ExamAttemptDetailView(generics.RetrieveAPIView):
    queryset = ExamAttempt.objects.all()
    serializer_class = ExamAttemptSerializer
    permission_classes = (permissions.AllowAny,) 

class CertificateCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CertificateCommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return CertificateComment.objects.filter(attempt_id=self.kwargs['pk']).order_by('-created_at')

    def perform_create(self, serializer):
        attempt = generics.get_object_or_404(ExamAttempt, pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, attempt=attempt)

class CertificateLikeToggleView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        attempt = generics.get_object_or_404(ExamAttempt, pk=pk)
        like, created = CertificateLike.objects.get_or_create(user=request.user, attempt=attempt)
        if not created:
            like.delete()
            return Response({'liked': False, 'likes_count': attempt.likes.count()})
        return Response({'liked': True, 'likes_count': attempt.likes.count()})
