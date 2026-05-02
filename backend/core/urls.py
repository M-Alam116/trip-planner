from django.urls import path
from logs.views import calculate_logs

urlpatterns = [
    path('api/logs/calculate/', calculate_logs),
]