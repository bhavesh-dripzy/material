# Interior Design Platform - Deployment Guide

Complete deployment documentation for the Interior Design Platform (Houzzat) running on GCP VM with Django backend and React frontend.

## 📋 Table of Contents

- [Infrastructure Overview](#infrastructure-overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [HTTPS Setup](#https-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Manual Deployment Commands](#manual-deployment-commands)
- [Troubleshooting](#troubleshooting)

## 🏗️ Infrastructure Overview

### Server Details
- **VM Provider**: Google Cloud Platform (GCP)
- **VM IP**: `34.73.5.92`
- **Domain**: `houzzat.in` (with `www.houzzat.in`)
- **VM User**: `nishkarsh`
- **VM Zone**: `us-east1-c`
- **VM Name**: `djangostack-interior-vm`

### Application Structure
- **Backend**: Django REST Framework
- **Frontend**: React + Vite
- **Web Server**: Nginx (reverse proxy)
- **WSGI Server**: Gunicorn
- **SSL**: Let's Encrypt (Certbot)
- **Database**: MySQL

### Directory Structure on VM
```
/var/www/interior-app/
├── backend/          # Django application
│   ├── venv/         # Python virtual environment
│   ├── staticfiles/  # Collected static files
│   └── media/        # User uploaded media
└── frontend/
    └── dist/         # Built React application
```

## 📦 Prerequisites

### Local Machine
- Git
- Node.js 18+ and npm
- Python 3.9+
- SSH access to VM
- GCP account (for firewall rules)

### VM Requirements
- Ubuntu/Debian Linux
- Python 3.9+
- Node.js 18+ (for building frontend)
- Nginx
- MySQL
- Certbot (for SSL)

## 🚀 Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/bhavesh-dripzy/interior.git
cd interior
```

### 2. SSH Access Setup
```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "deployment"

# Copy public key to VM
ssh-copy-id nishkarsh@34.73.5.92

# Test SSH connection
ssh nishkarsh@34.73.5.92
```

### 3. VM Initial Setup (Run on VM)

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y python3-pip python3-venv nginx mysql-server certbot python3-certbot-nginx

# Create application directory
sudo mkdir -p /var/www/interior-app/{backend,frontend}
sudo chown -R nishkarsh:nishkarsh /var/www/interior-app
```

## 🔧 Backend Deployment

### Step 1: Prepare Backend Files

```bash
# On local machine
cd interior/backend

# Create deployment archive (excludes venv, cache, etc.)
tar -czf backend-deploy.tar.gz \
  --exclude='venv' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='.git' \
  --exclude='db.sqlite3' \
  --exclude='media' \
  --exclude='staticfiles' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='*.swp' \
  --exclude='*.tmp' \
  .
```

### Step 2: Transfer to VM

```bash
# Transfer archive to VM
scp backend-deploy.tar.gz nishkarsh@34.73.5.92:~/
```

### Step 3: Deploy on VM

```bash
# SSH into VM
ssh nishkarsh@34.73.5.92

# Extract and deploy
cd ~
tar -xzf backend-deploy.tar.gz
sudo cp -r * /var/www/interior-app/backend/

# Set up virtual environment (first time only)
cd /var/www/interior-app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file (if not exists)
cat > .env << 'EOF'
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,houzzat.in,www.houzzat.in,34.73.5.92
DB_ENGINE=mysql
DB_NAME=houzatt_db
DB_USER=root
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=3306
EOF

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Set permissions
sudo chown -R www-data:www-data /var/www/interior-app/backend
```

### Step 4: Configure Gunicorn

Create systemd service file:

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Add this content:

```ini
[Unit]
Description=gunicorn daemon for interior app
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/interior-app/backend
ExecStart=/var/www/interior-app/backend/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/var/www/interior-app/backend/gunicorn.sock \
          config.wsgi:application

Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start Gunicorn:

```bash
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl status gunicorn
```

## 🎨 Frontend Deployment

### Step 1: Build Frontend

```bash
# On local machine
cd interior

# Install dependencies (first time only)
npm install

# Build with production API URL
VITE_API_BASE_URL=https://houzzat.in/api npm run build

# Verify build
ls -la dist/
```

### Step 2: Transfer to VM

```bash
# Create archive
cd interior
tar -czf frontend-dist.tar.gz -C dist .

# Transfer to VM
scp frontend-dist.tar.gz nishkarsh@34.73.5.92:~/
```

### Step 3: Deploy on VM

```bash
# SSH into VM
ssh nishkarsh@34.73.5.92

# Extract and deploy
cd ~
tar -xzf frontend-dist.tar.gz
sudo rm -rf /var/www/interior-app/frontend/dist/*
sudo cp -r * /var/www/interior-app/frontend/dist/
sudo chown -R www-data:www-data /var/www/interior-app/frontend
```

## 🌐 Nginx Configuration

### Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/interior-app
```

Add this configuration:

```nginx
server {
    server_name houzzat.in www.houzzat.in;

    client_max_body_size 100M;

    # Serve static files
    location /static/ {
        alias /var/www/interior-app/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Serve media files
    location /media/ {
        alias /var/www/interior-app/backend/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Backend API
    location /api/ {
        proxy_pass http://unix:/var/www/interior-app/backend/gunicorn.sock;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header Connection "";
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://unix:/var/www/interior-app/backend/gunicorn.sock;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header Connection "";
    }

    # Serve frontend (React app)
    location / {
        root /var/www/interior-app/frontend/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/houzzat.in/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/houzzat.in/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.houzzat.in) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = houzzat.in) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name houzzat.in www.houzzat.in;
    return 404; # managed by Certbot
}
```

Enable site and restart Nginx:

```bash
sudo ln -sf /etc/nginx/sites-available/interior-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 HTTPS Setup

### Step 1: DNS Configuration

1. Go to your domain registrar (e.g., GoDaddy, Namecheap)
2. Add A records:
   - `@` → `34.73.5.92`
   - `www` → `34.73.5.92`
3. Wait for DNS propagation (5-30 minutes)

### Step 2: Install SSL Certificate

```bash
# SSH into VM
ssh nishkarsh@34.73.5.92

# Install Certbot (if not installed)
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d houzzat.in -d www.houzzat.in \
  --non-interactive \
  --agree-tos \
  --email agarwalbhavesh19354@gmail.com \
  --redirect

# Verify certificate
sudo certbot certificates

# Set up automatic renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 3: Configure GCP Firewall

1. Go to [GCP Console](https://console.cloud.google.com)
2. Navigate to: **VPC network** → **Firewall**
3. Create firewall rule:
   - **Name**: `allow-https`
   - **Direction**: Ingress
   - **Action**: Allow
   - **Targets**: All instances
   - **Source IP ranges**: `0.0.0.0/0`
   - **Protocols and ports**: TCP port `443`

Or use gcloud CLI:

```bash
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTPS traffic"
```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys on push to `main` branch.

### Required GitHub Secrets

Add these secrets in GitHub repository settings:

1. **VM_SSH_PRIVATE_KEY**: Your private SSH key
   ```bash
   # Get your private key
   cat ~/.ssh/id_ed25519
   # Copy entire output including BEGIN/END markers
   ```

2. **VM_USER**: `nishkarsh`

### Manual Workflow Trigger

The workflow can be manually triggered from GitHub Actions tab → "Run workflow"

## 📝 Manual Deployment Commands

### Quick Backend Deployment

```bash
# From project root
cd interior/backend
tar -czf /tmp/backend-deploy.tar.gz \
  --warning=no-file-changed \
  --exclude='venv' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='.git' \
  --exclude='db.sqlite3' \
  --exclude='media' \
  --exclude='staticfiles' \
  --exclude='*.log' \
  .

scp /tmp/backend-deploy.tar.gz nishkarsh@34.73.5.92:~/

ssh nishkarsh@34.73.5.92 'cd ~ && tar -xzf backend-deploy.tar.gz && \
  sudo cp -r * /var/www/interior-app/backend/ && \
  cd /var/www/interior-app/backend && \
  source venv/bin/activate && \
  pip install -r requirements.txt --quiet && \
  python manage.py migrate --noinput && \
  python manage.py collectstatic --noinput && \
  sudo chown -R www-data:www-data /var/www/interior-app/backend && \
  sudo systemctl restart gunicorn && \
  echo "✅ Backend deployed"'
```

### Quick Frontend Deployment

```bash
# From project root
cd interior
VITE_API_BASE_URL=https://houzzat.in/api npm run build

tar -czf /tmp/frontend-dist.tar.gz -C dist .
scp /tmp/frontend-dist.tar.gz nishkarsh@34.73.5.92:~/

ssh nishkarsh@34.73.5.92 'cd ~ && tar -xzf frontend-dist.tar.gz && \
  sudo rm -rf /var/www/interior-app/frontend/dist/* && \
  sudo cp -r * /var/www/interior-app/frontend/dist/ && \
  sudo chown -R www-data:www-data /var/www/interior-app/frontend && \
  sudo systemctl reload nginx && \
  echo "✅ Frontend deployed"'
```

### Full Deployment (Backend + Frontend)

```bash
# Backend
cd interior/backend
tar -czf /tmp/backend-deploy.tar.gz --warning=no-file-changed \
  --exclude='venv' --exclude='__pycache__' --exclude='*.pyc' \
  --exclude='.git' --exclude='db.sqlite3' --exclude='media' \
  --exclude='staticfiles' --exclude='*.log' .
scp /tmp/backend-deploy.tar.gz nishkarsh@34.73.5.92:~/

# Frontend
cd ../..
cd interior
VITE_API_BASE_URL=https://houzzat.in/api npm run build
tar -czf /tmp/frontend-dist.tar.gz -C dist .
scp /tmp/frontend-dist.tar.gz nishkarsh@34.73.5.92:~/

# Deploy both
ssh nishkarsh@34.73.5.92 'cd ~ && \
  tar -xzf backend-deploy.tar.gz && \
  sudo cp -r * /var/www/interior-app/backend/ && \
  cd /var/www/interior-app/backend && \
  source venv/bin/activate && \
  pip install -r requirements.txt --quiet && \
  python manage.py migrate --noinput && \
  python manage.py collectstatic --noinput && \
  sudo chown -R www-data:www-data /var/www/interior-app/backend && \
  sudo systemctl restart gunicorn && \
  cd ~ && \
  tar -xzf frontend-dist.tar.gz && \
  sudo rm -rf /var/www/interior-app/frontend/dist/* && \
  sudo cp -r * /var/www/interior-app/frontend/dist/ && \
  sudo chown -R www-data:www-data /var/www/interior-app/frontend && \
  sudo systemctl reload nginx && \
  echo "✅ Full deployment complete"'
```

## 🔍 Useful Commands

### Check Service Status

```bash
# Gunicorn status
sudo systemctl status gunicorn

# Nginx status
sudo systemctl status nginx

# View Gunicorn logs
sudo journalctl -u gunicorn -f

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services

```bash
# Restart Gunicorn
sudo systemctl restart gunicorn

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (no downtime)
sudo systemctl reload nginx
```

### Test Configuration

```bash
# Test Nginx config
sudo nginx -t

# Test Django
cd /var/www/interior-app/backend
source venv/bin/activate
python manage.py check

# Test API endpoint
curl https://houzzat.in/api/health/
```

### Database Operations

```bash
# Access MySQL
sudo mysql -u root -p

# Create database (if needed)
CREATE DATABASE houzatt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Run migrations
cd /var/www/interior-app/backend
source venv/bin/activate
python manage.py migrate
```

## 🐛 Troubleshooting

### Backend Not Responding

```bash
# Check Gunicorn is running
sudo systemctl status gunicorn

# Check socket permissions
ls -la /var/www/interior-app/backend/gunicorn.sock

# Check logs
sudo journalctl -u gunicorn -n 50
```

### Frontend Not Loading

```bash
# Check Nginx is running
sudo systemctl status nginx

# Check file permissions
ls -la /var/www/interior-app/frontend/dist/

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test SSL
openssl s_client -connect houzzat.in:443
```

### API CORS Errors

Check Django settings:
```python
# In settings.py
CORS_ALLOWED_ORIGINS = [
    "https://houzzat.in",
    "https://www.houzzat.in",
]
```

### Browser Cache Issues

- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear site data in DevTools → Application tab
- Use Incognito/Private mode for testing

### Permission Errors

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/interior-app

# Fix permissions
sudo chmod -R 755 /var/www/interior-app
```

## 📚 Additional Resources

### Django Settings

Key settings in `interior/backend/config/settings.py`:

- `ALLOWED_HOSTS`: Domain names allowed to access the site
- `CORS_ALLOWED_ORIGINS`: Frontend origins allowed for API access
- `DEBUG`: Set to `False` in production
- `SECURE_SSL_REDIRECT`: HTTPS security settings

### Environment Variables

Create `.env` file in backend directory:

```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,houzzat.in,www.houzzat.in,34.73.5.92
DB_ENGINE=mysql
DB_NAME=houzatt_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306
```

### Frontend Environment

Build with environment variable:

```bash
VITE_API_BASE_URL=https://houzzat.in/api npm run build
```

## 🔐 Security Notes

1. **Never commit `.env` files** - Contains sensitive credentials
2. **Use strong SECRET_KEY** - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
3. **Keep dependencies updated** - Regularly run `pip install -r requirements.txt --upgrade`
4. **Monitor logs** - Check for suspicious activity
5. **Backup database** - Regular backups recommended

## 📞 Support

For issues or questions:
- Check logs: `sudo journalctl -u gunicorn -f`
- Check Nginx: `sudo tail -f /var/log/nginx/error.log`
- Verify services: `sudo systemctl status gunicorn nginx`

---

**Last Updated**: December 27, 2025
**Deployed Version**: Production
**Domain**: https://houzzat.in
