from django.contrib import admin
from .models import ExamAttempt

@admin.register(ExamAttempt)
class ExamAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'exam', 'score', 'is_passed', 'completed_at')
    list_filter = ('is_passed', 'exam')
    search_fields = ('user__username', 'exam__title')
    readonly_fields = ('completed_at',)
