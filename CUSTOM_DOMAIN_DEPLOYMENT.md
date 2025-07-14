# Custom Domain Deployment Guide - WealthTracker Pro

## Overview
This guide covers deploying WealthTracker Pro to your own domain using various hosting platforms.

## Option 1: VPS Deployment (Recommended)

### Requirements
- Ubuntu 20.04+ or CentOS 8+ server
- 2GB+ RAM, 20GB+ storage
- Root access
- Domain pointing to your server IP

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx postgresql postgresql-contrib python3 python3-pip nodejs npm git certbot python3-certbot-nginx

# Install PM2 for process management
sudo npm install -g pm2

# Create application user
sudo useradd -m -s /bin/bash wealthtracker
sudo usermod -aG sudo wealthtracker
```

### Step 2: Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE wealthtracker;
CREATE USER wealthtracker WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE wealthtracker TO wealthtracker;
\q
```

### Step 3: Deploy Application
```bash
# Switch to application user
sudo su - wealthtracker

# Clone your repository
git clone https://github.com/dgoggin07952/WealthTracker.git
cd WealthTracker

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install
npm run build
```

### Step 4: Environment Configuration
```bash
# Create environment file
cat > /home/wealthtracker/WealthTracker/backend/.env << EOF
DATABASE_URL=postgresql://wealthtracker:your_secure_password@localhost/wealthtracker
JWT_SECRET_KEY=$(openssl rand -base64 32)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
EOF
```

### Step 5: Nginx Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/wealthtracker
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /home/wealthtracker/WealthTracker/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Step 6: Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/wealthtracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 7: Start Services
```bash
# Start backend with PM2
cd /home/wealthtracker/WealthTracker/backend
source venv/bin/activate
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name wealthtracker-backend
pm2 startup
pm2 save
```

## Option 2: Docker Deployment

### Step 1: Create Docker Files
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

### Step 2: Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: wealthtracker
      POSTGRES_USER: wealthtracker
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build: ./backend
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://wealthtracker:your_secure_password@db/wealthtracker
      JWT_SECRET_KEY: your_jwt_secret
    restart: unless-stopped

  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 3: Deploy with Docker
```bash
# Deploy
docker-compose up -d

# Setup SSL with Let's Encrypt
docker exec -it frontend_container_name certbot --nginx -d yourdomain.com
```

## Option 3: Cloud Platform Deployment

### AWS Deployment
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Configure AWS
aws configure

# Deploy using Elastic Beanstalk
eb init wealthtracker-pro
eb create production
eb deploy
```

### Google Cloud Platform
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Deploy to App Engine
gcloud app deploy app.yaml
```

### Azure Deployment
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Deploy to Azure App Service
az webapp up --name wealthtracker-pro --resource-group myResourceGroup
```

## Option 4: CDN + Serverless

### Frontend: Vercel/Netlify
```bash
# Vercel deployment
npm i -g vercel
cd frontend
vercel --prod

# Netlify deployment
npm i -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Backend: Railway/Render
```bash
# Railway deployment
npm i -g @railway/cli
railway login
railway deploy

# Render deployment
# Connect GitHub repository to Render dashboard
```

## Domain Configuration

### DNS Settings
Point your domain to your server:
```
A Record: @ -> Your_Server_IP
A Record: www -> Your_Server_IP
CNAME Record: api -> yourdomain.com
```

### SSL Certificate
```bash
# Let's Encrypt (free)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Or use Cloudflare SSL (recommended)
# Enable SSL/TLS in Cloudflare dashboard
```

## Security Configuration

### Firewall Setup
```bash
# UFW configuration
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### Security Headers
Add to Nginx configuration:
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Monitoring and Maintenance

### Log Monitoring
```bash
# View application logs
pm2 logs wealthtracker-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# Automated backup script
#!/bin/bash
pg_dump -h localhost -U wealthtracker wealthtracker > /backup/wealthtracker_$(date +%Y%m%d_%H%M%S).sql
```

### Updates
```bash
# Update application
cd /home/wealthtracker/WealthTracker
git pull origin main
cd backend && source venv/bin/activate && pip install -r requirements.txt
cd ../frontend && npm install && npm run build
pm2 restart wealthtracker-backend
```

## Cost Breakdown

### VPS Hosting (Monthly)
- **DigitalOcean**: $20-40
- **Linode**: $20-40
- **AWS EC2**: $25-50
- **Google Cloud**: $25-50

### Managed Services
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **Railway**: $5-20/month
- **Render**: $7-25/month

### Domain + SSL
- **Domain**: $10-15/year
- **SSL**: Free (Let's Encrypt) or $50-100/year

## Recommended Setup

For production deployment, I recommend:
1. **Frontend**: Vercel or Netlify (CDN, automatic deployments)
2. **Backend**: Railway or Render (managed hosting)
3. **Database**: Managed PostgreSQL (AWS RDS, Google Cloud SQL)
4. **Domain**: Cloudflare for DNS and SSL
5. **Monitoring**: Sentry for error tracking

This setup provides:
- High availability and performance
- Automatic scaling
- Easy deployments
- Professional SSL certificates
- Global CDN distribution

Total monthly cost: $30-60 for a professional setup.

Would you like me to help you set up any specific deployment option?