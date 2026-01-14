# Design Specifications

## 1. Database Model Definitions (Django style)

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    total_score = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    level = models.IntegerField(default=1)

    class Meta:
        ordering = ['-total_score']

class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='courses/')
    created_at = models.DateTimeField(auto_now_add=True)

class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()  # Focus on Markdown or Rich Text
    code_snippet = models.TextField(blank=True)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

class Exam(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    duration_minutes = models.IntegerField()
    passing_score = models.IntegerField()
    is_active = models.BooleanField(default=True)

class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    points = models.IntegerField(default=10)

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

class ExamAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    score = models.IntegerField()
    time_taken = models.IntegerField()  # In seconds
    is_passed = models.BooleanField()
    completed_at = models.DateTimeField(auto_now_add=True)
```

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Obtain JWT tokens |
| GET | `/api/users/me/` | Current user profile |
| GET | `/api/users/leaderboard/` | Leaderboard data |
| GET | `/api/courses/` | List all courses |
| GET | `/api/courses/{slug}/` | Course details & lessons |
| GET | `/api/exams/{id}/` | Get exam details |
| POST | `/api/exams/{id}/submit/` | Submit exam answers |

## 3. Sample UI Structure (React)

### App.jsx
```jsx
<Router>
  <Sidebar />
  <main className="flex-1 bg-gray-50 dark:bg-slate-900">
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/courses" element={<CourseCatalog />} />
      <Route path="/courses/:slug" element={<CourseLessons />} />
      <Route path="/exam/:id" element={<ExamPortal />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </main>
</Router>
```

### Dashboard View
- **Top Row**: Stats cards (Score, Rank, Exams Passed).
- **Middle Row**: Progress chart (Performance over time).
- **Bottom Row**: "Continue Learning" (Last active course) and "Top Performers" (Global mini-leaderboard).

### Exam Portal View
- **Header**: Title, Questions Progress, Timer.
- **Main**: Question text + Choices (Radio buttons).
- **Footer**: Prev/Next buttons + Submit.

## 4. Visual Language & Aesthetics (Premium Design)
- **Primary Color**: `#6366f1` (Indigo 500)
- **Secondary Color**: `#f59e0b` (Amber 500) for ranks/medals
- **Dark Mode**: Deep slate `#0f172a` background with vibrant indigo accents.
- **Typography**: `Inter` for UI, `JetBrains Mono` for code snippets.
- **Effects**: Backdrop blur (glassmorphism) on modals and sidebars, subtle hover lifts on cards.
