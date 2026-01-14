import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Course, Lesson
from exams.models import Exam, Question, Choice

def seed():
    # Create a Course
    course, created = Course.objects.get_or_create(
        title="Full Stack Web Development with React & Django",
        defaults={
            'description': "Learn how to build modern web applications using Django REST Framework and React.",
            'category': 'Web Development',
            'difficulty': 'intermediate'
        }
    )
    if created:
        print(f"Created course: {course.title}")
        
        # Add Lessons
        Lesson.objects.create(
            course=course,
            title="Introduction to Django",
            content="### Welcome to Django\nDjango is a high-level Python web framework...",
            code_snippet="import django\nprint(django.get_version())",
            order=1
        )
        Lesson.objects.create(
            course=course,
            title="Building APIs with DRF",
            content="### Django REST Framework\nLearn how to build powerful APIs...",
            code_snippet="from rest_framework import generics\nclass MyView(generics.ListAPIView): pass",
            order=2
        )
        Lesson.objects.create(
            course=course,
            title="React Basics",
            content="### Getting Started with React\nReact is a declarative, efficient, and flexible JavaScript library...",
            code_snippet="const App = () => <h1>Hello React</h1>;",
            order=3
        )

        # Add Exam
        exam = Exam.objects.create(
            course=course,
            title="Full Stack Fundamentals Exam",
            description="Test your knowledge on React and Django integration.",
            duration_minutes=15,
            passing_score=70
        )

        # Add Questions
        q1 = Question.objects.create(exam=exam, text="Which HTTP method is typically used to create a new resource in a REST API?", points=25)
        Choice.objects.create(question=q1, text="GET", is_correct=False)
        Choice.objects.create(question=q1, text="POST", is_correct=True)
        Choice.objects.create(question=q1, text="PUT", is_correct=False)
        Choice.objects.create(question=q1, text="DELETE", is_correct=False)

        q2 = Question.objects.create(exam=exam, text="What hook is used to handle side effects in a React functional component?", points=25)
        Choice.objects.create(question=q2, text="useState", is_correct=False)
        Choice.objects.create(question=q2, text="useEffect", is_correct=True)
        Choice.objects.create(question=q2, text="useContext", is_correct=False)
        Choice.objects.create(question=q2, text="useReducer", is_correct=False)

        q3 = Question.objects.create(exam=exam, text="What is the default database used by Django when a new project is created?", points=25)
        Choice.objects.create(question=q3, text="PostgreSQL", is_correct=False)
        Choice.objects.create(question=q3, text="MySQL", is_correct=False)
        Choice.objects.create(question=q3, text="SQLite", is_correct=True)
        Choice.objects.create(question=q3, text="MongoDB", is_correct=False)

        q4 = Question.objects.create(exam=exam, text="In Django, which file is used to define the API endpoint paths?", points=25)
        Choice.objects.create(question=q4, text="models.py", is_correct=False)
        Choice.objects.create(question=q4, text="serializers.py", is_correct=False)
        Choice.objects.create(question=q4, text="urls.py", is_correct=True)
        Choice.objects.create(question=q4, text="views.py", is_correct=False)

        print(f"Created exam and questions for: {course.title}")
    else:
        print(f"Course already exists: {course.title}")

if __name__ == "__main__":
    seed()
