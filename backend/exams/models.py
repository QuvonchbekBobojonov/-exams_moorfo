from django.db import models
from courses.models import Course

class Exam(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='exam')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    duration_minutes = models.IntegerField(default=30)
    passing_score = models.IntegerField(default=60)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    code = models.TextField(blank=True, null=True)
    points = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.exam.title} - {self.text[:50]}"

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.text[:30]} - {self.text}"
