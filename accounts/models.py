from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True)
    newsletter_subscribed = models.BooleanField(default=False)
    

    def __str__(self):
        return f"{self.user.username} Profile"
    

class PasswordResetOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)
    