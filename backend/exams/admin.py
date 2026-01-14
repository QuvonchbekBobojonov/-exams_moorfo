from django.contrib import admin
from .models import Exam, Question, Choice

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'duration_minutes', 'passing_score', 'is_active')
    list_filter = ('is_active', 'course')
    search_fields = ('title',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'exam', 'points')
    inlines = [ChoiceInline]

admin.site.register(Choice)
