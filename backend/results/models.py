from django.db import models
from django.conf import settings
from exams.models import Exam

class ExamAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attempts')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    score = models.IntegerField()
    earned_points = models.IntegerField(default=0)
    time_taken = models.IntegerField()  # In seconds
    is_passed = models.BooleanField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.exam.title} - {self.score}"

    class Meta:
        ordering = ['-completed_at']
