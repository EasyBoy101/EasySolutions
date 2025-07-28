# Base image
FROM python:3.11-slim

# Set environment vars
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8080

CMD ["waitress-serve", "--listen=0.0.0.0:8080", "your_project_name.wsgi:application"]
