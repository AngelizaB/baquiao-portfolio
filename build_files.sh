#!/bin/bash
echo "Building project..."
pip install -r requirements.txt
python manage.py collectstatic --noinput
echo "Build complete."
