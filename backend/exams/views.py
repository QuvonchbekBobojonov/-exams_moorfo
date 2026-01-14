from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Exam, Question, Choice
from .serializers import ExamSerializer
from results.models import ExamAttempt
from results.serializers import ExamAttemptSerializer

class ExamDetailView(generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ExamSubmitView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        exam = get_object_or_404(Exam, pk=pk)
        answers = request.data.get('answers', {})  # Expected: {question_id: choice_id}
        time_taken = request.data.get('time_taken', 0)

        total_points = 0
        earned_points = 0

        for question in exam.questions.all():
            total_points += question.points
            selected_choice_id = answers.get(str(question.id))
            if selected_choice_id:
                try:
                    choice = Choice.objects.get(id=selected_choice_id, question=question)
                    if choice.is_correct:
                        earned_points += question.points
                except Choice.DoesNotExist:
                    pass

        score_percentage = (earned_points / total_points * 100) if total_points > 0 else 0
        is_passed = score_percentage >= exam.passing_score

        attempt = ExamAttempt.objects.create(
            user=request.user,
            exam=exam,
            score=int(score_percentage),
            earned_points=earned_points if is_passed else 0,
            time_taken=time_taken,
            is_passed=is_passed
        )

        # Update user total score if passed (simplified logic)
        # Always update study time
        request.user.study_time += (time_taken // 60)
        
        if is_passed:
            request.user.total_score += earned_points
            request.user.save()
            # Update ranks for all users
            from users.models import User
            User.update_ranks()
        else:
            request.user.save()

        return Response(ExamAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)
