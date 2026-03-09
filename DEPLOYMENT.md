# ArogyaMitra - Deployment Guide

## 🚀 Production Deployment Checklist

### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Domain name (optional but recommended)
- Node.js 16+ installed
- Python 3.10+ installed
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt)

---

## 📦 Backend Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Deploy Backend

```bash
# Create application directory
sudo mkdir -p /var/www/arogyamitra
cd /var/www/arogyamitra

# Clone or upload your code
git clone <your-repo-url> backend
# OR upload via SCP/SFTP

cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create production .env file
nano .env
```

**Production .env Configuration:**
```env
GROQ_API_KEY=your-production-groq-api-key
SECRET_KEY=generate-a-strong-random-secret-key-here
DATABASE_URL=sqlite:///./arogyamitra.db
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Generate secure SECRET_KEY:**
```python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Create SystemD Service

Create `/etc/systemd/system/arogyamitra.service`:

```ini
[Unit]
Description=ArogyaMitra Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/arogyamitra/backend
Environment="PATH=/var/www/arogyamitra/backend/venv/bin"
ExecStart=/var/www/arogyamitra/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Start the service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable arogyamitra
sudo systemctl start arogyamitra
sudo systemctl status arogyamitra
```

---

## 🌐 Frontend Deployment

### 1. Build Frontend

**On your development machine:**
```bash
cd frontend

# Install dependencies
npm install

# Create production build
npm run build
```

This creates a `dist/` folder with optimized static files.

### 2. Upload to Server

```bash
# Upload dist folder to server
scp -r dist/* user@your-server:/var/www/arogyamitra/frontend/
```

---

## 🔧 Nginx Configuration

### 1. Create Nginx Config

Create `/etc/nginx/sites-available/arogyamitra`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React App)
    location / {
        root /var/www/arogyamitra/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API documentation
    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Increase upload size for large requests
    client_max_body_size 10M;
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/arogyamitra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts and choose to redirect HTTP to HTTPS.

### 3. Update Frontend API URL

**Edit `frontend/src/services/api.ts`:**
```typescript
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Rebuild frontend after changes:**
```bash
npm run build
# Upload new dist/ to server
```

---

## 🗄️ Database Migration (SQLite → PostgreSQL)

For production, consider PostgreSQL for better performance:

### 1. Install PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib -y
```

### 2. Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE arogyamitra;
CREATE USER arogyamitra_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE arogyamitra TO arogyamitra_user;
\q
```

### 3. Update Backend

**Install PostgreSQL driver:**
```bash
pip install psycopg2-binary
```

**Update .env:**
```env
DATABASE_URL=postgresql://arogyamitra_user:secure_password_here@localhost/arogyamitra
```

**Restart service:**
```bash
sudo systemctl restart arogyamitra
```

---

## 📊 Monitoring & Maintenance

### 1. View Logs

```bash
# Backend logs
sudo journalctl -u arogyamitra -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Database Backup

**SQLite:**
```bash
# Backup
cp /var/www/arogyamitra/backend/arogyamitra.db /backup/arogyamitra_$(date +%Y%m%d).db

# Restore
cp /backup/arogyamitra_20260305.db /var/www/arogyamitra/backend/arogyamitra.db
```

**PostgreSQL:**
```bash
# Backup
pg_dump arogyamitra > /backup/arogyamitra_$(date +%Y%m%d).sql

# Restore
psql arogyamitra < /backup/arogyamitra_20260305.sql
```

### 3. Automated Backups (Cron)

```bash
sudo crontab -e
```

Add:
```cron
# Daily backup at 2 AM
0 2 * * * cp /var/www/arogyamitra/backend/arogyamitra.db /backup/arogyamitra_$(date +\%Y\%m\%d).db

# Keep only last 7 days
0 3 * * * find /backup/ -name "arogyamitra_*.db" -mtime +7 -delete
```

---

## 🔐 Security Best Practices

### 1. Firewall Setup

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Rate Limiting (Nginx)

Add to Nginx config:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # ... rest of config
}
```

### 3. Environment Variables Security

```bash
# Restrict .env permissions
chmod 600 /var/www/arogyamitra/backend/.env
chown www-data:www-data /var/www/arogyamitra/backend/.env
```

### 4. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Python packages
cd /var/www/arogyamitra/backend
source venv/bin/activate
pip install --upgrade -r requirements.txt

# Restart service after updates
sudo systemctl restart arogyamitra
```

---

## 🐳 Docker Deployment (Alternative)

### 1. Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - ./backend/arogyamitra.db:/app/arogyamitra.db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

**Deploy:**
```bash
docker-compose up -d
```

---

## 📈 Performance Optimization

### 1. Enable Gzip (Nginx)

Add to Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. Cache Static Assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Increase Worker Processes

In backend service file, increase workers:
```ini
ExecStart=/.../uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] SSL certificate active
- [ ] Database accessible
- [ ] User registration working
- [ ] AI features functional (Groq API)
- [ ] File uploads working
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Domain DNS configured
- [ ] Firewall rules active
- [ ] Error logging enabled

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check service status
sudo systemctl status arogyamitra

# View error logs
sudo journalctl -u arogyamitra -n 50
```

### Database connection errors
- Verify DATABASE_URL in .env
- Check database file permissions
- Ensure database exists

### CORS errors
- Update CORS_ORIGINS in backend/.env
- Include both http and https URLs

### 502 Bad Gateway
- Backend might not be running
- Check proxy_pass URL in Nginx config
- Verify backend is listening on correct port

---

**Deployment Complete! 🎉**

Access your app at: `https://yourdomain.com`
