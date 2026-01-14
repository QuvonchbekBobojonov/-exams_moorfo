from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'total_score', 'rank', 'level', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Gaming Stats', {'fields': ('avatar', 'bio', 'total_score', 'rank', 'level')}),
    )

admin.site.register(User, CustomUserAdmin)
