#!/bin/sh

# Wait for database to be ready (optional but recommended if not using depends_on healthcheck)
# echo "Waiting for postgres..."

# Run migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start gunicorn
echo "Starting server..."
exec gunicorn --bind 0.0.0.0:8000 core.wsgi:application
