from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Profile


class RegisterForm(UserCreationForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter email'}),
        help_text="We'll never share your email with anyone else."
    )

    terms_of_service = forms.BooleanField(
        required=True,
        label="Accept Terms of Service",
        error_messages={'required': 'You must agree to the Terms of Service to register.'}
    )

    newsletter = forms.BooleanField(
        required=False,
        label="Subscribe to our newsletter"
    )
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 
                  'last_name', 'email', 
                  'password1', 'password2', 
                  'terms_of_service', 'newsletter']

    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] = 'form-control'
        self.fields['password1'].widget.attrs['class'] = 'form-control'
        self.fields['password2'].widget.attrs['class'] = 'form-control'
        self.fields['first_name'].widget.attrs['class'] = 'form-control'
        self.fields['last_name'].widget.attrs['class'] = 'form-control'
        self.fields['email'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Enter your email',
            'id': 'email-field',
            'type': 'email',

        })
        self.fields['email'].help_text = "We'll never share your email with anyone else."
    
   

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already in use.")
        return email

    def save(self, commit = True):
        user = super().save(commit=commit)
        
        Profile.objects.create(user=user)

        newsletter = self.cleaned_data.get('newsletter', False)
        user.profile.newsletter_subscribed = newsletter
        user.profile.save()
        return user

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']
        widgets = {}
        for field in fields:
            widgets.update({field: forms.TextInput(attrs={'class':'form-control'})})

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['image', 'bio']
        widgets = {
            'image': forms.ClearableFileInput(
                attrs={
                        'class': 'rounded-circle',}
                        ),
            'bio': forms.Textarea(
                attrs={
                        'id': 'profileBio',
                        'rows': 4,  
                        'class': 'form-control',}
                        )
        }
                
