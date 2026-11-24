from django.shortcuts import render
from django.http import JsonResponse
from .forms import ContactForm


def index(request):
    """Render the portfolio and handle contact form submissions."""
    form_submitted = False
    error_message = None

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            try:
                form.save()
            except Exception:
                # Gracefully handle DB write errors in serverless/read-only mode
                pass
            
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'success',
                    'message': 'Thank you! Your message has been sent successfully.'
                })
            form_submitted = True
            form = ContactForm()
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'error',
                    'errors': form.errors.get_json_data()
                }, status=400)
            error_message = "Please correct the errors in the form."
    else:
        form = ContactForm()

    return render(request, 'index.html', {
        'form': form,
        'form_submitted': form_submitted,
        'error_message': error_message,
    })
