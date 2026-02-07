from django.db import models
from django.utils.text import slugify

class Course(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='courses/', null=True, blank=True)
    category = models.CharField(max_length=100, default='Technology')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    instructor_name = models.CharField(max_length=100, default='Expert Instructor')
    instructor_bio = models.TextField(blank=True, default='Professional software engineer with years of experience.')
    estimated_duration = models.CharField(max_length=50, default='10 hours')
    video_url = models.URLField(blank=True, null=True, help_text="Demo video URL for the course (e.g., YouTube)")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()  # Support for Markdown
    code_snippet = models.TextField(blank=True)
    video_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"
