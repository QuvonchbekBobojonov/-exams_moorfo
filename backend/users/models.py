from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    total_score = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    study_time = models.IntegerField(default=0)  # Total study time in minutes

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def save(self, *args, **kwargs):
        # Calculate level: 1 level per 1000 XP
        self.level = (self.total_score // 1000) + 1
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-total_score']

    @classmethod
    def update_ranks(cls):
        users = cls.objects.all().order_by('-total_score')
        for i, user in enumerate(users):
            user.rank = i + 1
            user.save(update_fields=['rank'])

    def __str__(self):
        return self.username
