from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    """Contact form powered by Django ModelForm."""

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Your Name',
                'class': 'form-input',
                'autocomplete': 'name',
                'required': 'required',
                'id': 'contact-name',
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'Your Email Address',
                'class': 'form-input',
                'autocomplete': 'email',
                'required': 'required',
                'id': 'contact-email',
            }),
            'subject': forms.TextInput(attrs={
                'placeholder': 'Subject / Topic',
                'class': 'form-input',
                'required': 'required',
                'id': 'contact-subject',
            }),
            'message': forms.Textarea(attrs={
                'placeholder': 'Write your message here...',
                'class': 'form-input form-textarea',
                'rows': 5,
                'required': 'required',
                'id': 'contact-message',
            }),
        }
