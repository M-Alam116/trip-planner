from django.urls import path
from django.http import JsonResponse
from logs.views import calculate_logs

def home(request):
    return JsonResponse({"status": "Backend is Running", "version": "1.0.0"})

urlpatterns = [
    path('', home),
    path('api/logs/calculate/', calculate_logs),
]