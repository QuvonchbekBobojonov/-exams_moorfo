from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, RegisterSerializer, PublicUserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class LeaderboardView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        period = self.request.query_params.get('period', 'all')
        if period == 'all':
            return User.objects.all().order_by('-total_score')[:50]
        
        # For weekly/monthly, we need to sum earned_points from ExamAttempt
        from results.models import ExamAttempt
        from django.db.models import Sum, Q
        from django.utils import timezone
        import datetime

        start_date = None
        if period == 'weekly':
            start_date = timezone.now() - datetime.timedelta(days=7)
        elif period == 'monthly':
            start_date = timezone.now() - datetime.timedelta(days=30)
        
        if start_date:
            # Get users who earned points in this period
            # This is a bit tricky with standard DRF queryset if we want to return User objects with periodic score
            # A simpler way is to annotate the period_score
            return User.objects.annotate(
                period_score=Sum('attempts__earned_points', filter=Q(attempts__completed_at__gte=start_date))
            ).filter(period_score__gt=0).order_by('-period_score')[:50]

        return User.objects.all().order_by('-total_score')[:50]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        period = request.query_params.get('period', 'all')
        
        # If period is not 'all', we should use period_score for the response
        if period != 'all' and period in ['weekly', 'monthly']:
            data = []
            for user in queryset:
                user_data = UserSerializer(user).data
                user_data['total_score'] = user.period_score # Override for the leaderboard display
                data.append(user_data)
            return Response(data)
        
        return super().list(request, *args, **kwargs)

class DashboardStatsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        from results.models import ExamAttempt
        from django.db.models import Sum
        
        exams_taken = ExamAttempt.objects.filter(user=user).count()
        # XP progression (last 7 days)
        from django.utils import timezone
        import datetime
        
        progression = []
        today = timezone.now().date()
        for i in range(6, -1, -1):
            day = today - datetime.timedelta(days=i)
            # Sum earned_points for that day
            day_score = ExamAttempt.objects.filter(
                user=user, 
                completed_at__date=day
            ).aggregate(total=Sum('earned_points'))['total'] or 0
            
            progression.append({
                'name': day.strftime('%a'),
                'score': day_score
            })

        return Response({
            'total_xp': user.total_score,
            'rank': user.rank,
            'exams_taken': exams_taken,
            'study_time': user.study_time,
            'progression': progression
        })

class PublicUserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

# Management Admin Views
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

class AdminToggleStaffView(APIView):
    permission_classes = (permissions.IsAdminUser,) # Only superusers or staff? Standard isAdminUser checks is_staff or is_superuser

    def post(self, request, pk):
        if not request.user.is_superuser:
            return Response({"detail": "Faqat superuser stafflarni tahrirlay oladi."}, status=status.HTTP_403_FORBIDDEN)
        
        user = get_object_or_404(User, pk=pk)
        user.is_staff = not user.is_staff
        user.save()
        return Response(UserSerializer(user).data)
