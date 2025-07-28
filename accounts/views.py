from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.core.mail import send_mail
from .models import PasswordResetOTP
import random
# from django.contrib.auth.hashers import make_password
from django.contrib.auth import update_session_auth_hash

# from .models import Profile


# Create your views here.
def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            # user = form.save(commit=False)
            user = form.save()
        
            # user.save()
            # Profile.objects.create(user=user)
            """
            newsletter = form.cleaned_data.get('newsletter')
            user.profile.newsletter_subscribed = newsletter
            user.profile.save()
            """
            # return redirect('login')
            login(request, user)
            messages.success(request, f"Account created successfully! Welcome, {user.username} 🎉")
            return redirect('profile')

    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    if request.method =='POST':
        # username = request.POST['username']
        # password = request.POST['password']
        # user = authenticate(request, username=username, password=password)
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.username} 👋")
            return redirect('profile')
        else:
            messages.error(request, "Invalid username or password. Please try again.")
    else:
        form = AuthenticationForm()
        
    form.fields['username'].widget.attrs.update({'class': 'form-control'})
    form.fields['password'].widget.attrs.update({'class': 'form-control'})

    return render(request, 'accounts/login.html', {'form': form})
    

def logout_view(request):
    logout(request)
    return redirect('login')



@login_required
def profile_view(request):
    user =request.user
    profile = user.profile
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=profile)

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, "Your profile has been updated successfully ✅")
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=user)
        p_form = ProfileUpdateForm(instance=profile)
    
    context = {
        'u_form': u_form,
        'p_form': p_form
    }
    return render(request, 'accounts/profile_page.html', context)


@login_required
def send_otp_view(request):
    user = request.user

    if not user.email:
        messages.error(request, "Please update your profile with a valid email address first.")
        return redirect('profile')

    otp = str(random.randint(100000, 999999))

    PasswordResetOTP.objects.update_or_create(
        user=user,
        defaults={'otp_code': otp}
    )

    send_mail(
        subject="Password Change Request - Your Verification Code",
        message=(
        f"Hi {user.first_name or user.username},\n\n"
        f"You recently requested to change your account password.\n"
        f"Please use the verification code below to proceed:\n\n"
        f"🔐 OTP Code: {otp}\n\n"
        f"This code is valid for 10 minutes. Do not share it with anyone.\n\n"
        f"If you didn't initiate this request, you can safely ignore this email.\n\n"
        f"Best regards,\n"
        f"The Team"
    ),
        from_email="noreply@example.com",
        recipient_list=[user.email],
        fail_silently=False,
    )
    messages.success(request, "OTP has been sent to your email.")
    return redirect('profile')


@login_required
def change_password_view(request):
    if request.method == 'POST':
        otp_input = request.POST.get('otp')
        new_pw = request.POST.get('new_password1')
        confirm_pw = request.POST.get('new_password2')

        try:
            otp_record = PasswordResetOTP.objects.get(user=request.user)
        except PasswordResetOTP.DoesNotExist:
            messages.error(request, "Please request an OTP first.")
            return redirect('profile')

        if otp_record.is_expired():
            otp_record.delete()
            messages.error(request, "OTP expired. Request a new one.")
            return redirect('profile')

        if otp_record.otp_code != otp_input:
            messages.error(request, "Invalid OTP.")
            return redirect('profile')

        if new_pw != confirm_pw:
            messages.error(request, "Passwords do not match.")
            return redirect('profile')

        # All good: update password
        user = request.user
        user.set_password(new_pw)
        user.save()
        otp_record.delete()

        # Keep the user logged in
        update_session_auth_hash(request, user)

        messages.success(request, "Password updated successfully!")
        return redirect('profile')

    return redirect('profile')