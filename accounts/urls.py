from django.urls import path
from . import views
from .views import send_otp_view, change_password_view

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('send-otp/', send_otp_view, name='send_otp'),
    path('change-password/', change_password_view, name='change_password'),
]
