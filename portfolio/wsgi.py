"""
WSGI config for the portfolio project.
Exposes the WSGI callable as a module-level variable named ``application``.
Also exposes ``app`` for Vercel's Python runtime.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio.settings')

application = get_wsgi_application()
app = application
