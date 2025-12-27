# BuildQuick Django Backend

Django REST Framework backend for the BuildQuick construction materials delivery platform.

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. **Create a virtual environment:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env and update SECRET_KEY and other settings
```

4. **Run migrations:**

```bash
python manage.py migrate
```

5. **Create a superuser (optional):**

```bash
python manage.py createsuperuser
```

6. **Run the development server:**

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## 📁 Project Structure

```
backend/
├── config/           # Django project settings
│   ├── settings.py  # Main settings file
│   ├── urls.py      # Root URL configuration
│   ├── wsgi.py      # WSGI configuration
│   └── asgi.py      # ASGI configuration
├── api/             # API application
│   ├── models.py    # Database models
│   ├── views.py     # API views
│   ├── serializers.py  # DRF serializers
│   └── urls.py      # API URL routes
├── manage.py        # Django management script
├── requirements.txt # Python dependencies
└── .env            # Environment variables (not in git)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

- `SECRET_KEY`: Django secret key (generate a new one for production)
- `DEBUG`: Set to `False` in production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DB_ENGINE`: Database engine (default: SQLite)
- `DB_NAME`: Database name
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### Database Setup

By default, the project uses SQLite. To use PostgreSQL or MySQL:

1. Update the database settings in `.env`
2. Install the appropriate database adapter:
   - PostgreSQL: `pip install psycopg2-binary`
   - MySQL: `pip install mysqlclient`

## 📡 API Endpoints

- `GET /api/` - API root endpoint
- `GET /api/health/` - Health check endpoint
- `GET /admin/` - Django admin interface

## 🛠️ Development

### Running Tests

```bash
python manage.py test
```

### Creating Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Collecting Static Files

```bash
python manage.py collectstatic
```

## 🚢 Production Deployment

### Using Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Using Docker (optional)

Create a `Dockerfile` and `docker-compose.yml` for containerized deployment.

## 📝 Notes

- The backend is configured to allow CORS requests from `http://localhost:3000` (React dev server)
- WhiteNoise is configured for serving static files in production
- The API uses Django REST Framework for building RESTful APIs

