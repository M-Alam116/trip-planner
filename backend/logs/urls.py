from django.urls import path
from .views import calculate_logs

urlpatterns = [
    path('calculate/', calculate_logs),
]