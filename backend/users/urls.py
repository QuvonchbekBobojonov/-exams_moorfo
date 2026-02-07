from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ProfileView, LeaderboardView, 
    DashboardStatsView, PublicUserProfileView,
    AdminUserListView, AdminToggleStaffView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', ProfileView.as_view(), name='profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('profile/<int:pk>/', PublicUserProfileView.as_view(), name='public-profile'),
    
    # Management
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/toggle-staff/', AdminToggleStaffView.as_view(), name='admin-user-toggle-staff'),
]
