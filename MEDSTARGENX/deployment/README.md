# MEDSTARGENX Deployment Guide

## Server Information
- **Domain**: mgenx.com
- **IP Address**: 72.62.241.114
- **Server**: srv1264932.hstgr.cloud (KVM 2)
- **OS**: Ubuntu 24.04
- **Expires**: 2026-02-12

## Quick Deployment

### 1. SSH into VPS
```bash
ssh root@72.62.241.114
# Password: Udham.business@#5304
```

### 2. Run Deployment Script
```bash
# Download and run the deployment script
curl -o deploy.sh https://raw.githubusercontent.com/Akshit-Kheraj/Prediction/main/MEDSTARGENX/deployment/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will automatically:
- ✅ Update system packages
- ✅ Install Node.js 20.x
- ✅ Install MongoDB 7.0
- ✅ Install Python 3.12
- ✅ Install Nginx
- ✅ Install PM2 for process management
- ✅ Clone GitHub repository
- ✅ Build frontend
- ✅ Setup backend with PM2
- ✅ Setup ML API with systemd
- ✅ Configure Nginx reverse proxy
- ✅ Configure firewall

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

### Step 1: System Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Python and Nginx
sudo apt install -y python3.12 python3.12-venv python3-pip nginx

# Install PM2
sudo npm install -g pm2
```

### Step 2: Clone Repository
```bash
sudo mkdir -p /var/www/medstargenx
cd /var/www
sudo git clone https://github.com/Akshit-Kheraj/Prediction.git medstargenx
cd medstargenx
```

### Step 3: Setup Frontend
```bash
npm install
npm run build
```

### Step 4: Setup Backend
```bash
cd backend
npm install

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medstargenx
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-secure-refresh-secret-here
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://mgenx.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Start with PM2
cd /var/www/medstargenx
sudo mkdir -p /var/log/medstargenx
pm2 start deployment/ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root
```

### Step 5: Setup ML API
```bash
cd /var/www/medstargenx
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
cd ml_api
pip install -r requirements.txt

# Setup systemd service
sudo cp /var/www/medstargenx/deployment/ml_api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start ml_api
sudo systemctl enable ml_api
```

### Step 6: Configure Nginx
```bash
# Copy Nginx config
sudo cp /var/www/medstargenx/deployment/nginx.conf /etc/nginx/sites-available/medstargenx
sudo ln -s /etc/nginx/sites-available/medstargenx /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## SSL Certificate Setup (Optional but Recommended)

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate
```bash
sudo certbot --nginx -d mgenx.com -d www.mgenx.com
```

Follow the prompts and certbot will automatically configure HTTPS.

## Service Management

### Check Service Status
```bash
# MongoDB
sudo systemctl status mongod

# Backend (PM2)
pm2 status
pm2 logs medstargenx-backend

# ML API
sudo systemctl status ml_api
sudo journalctl -u ml_api -f

# Nginx
sudo systemctl status nginx
```

### Restart Services
```bash
# Backend
pm2 restart medstargenx-backend

# ML API
sudo systemctl restart ml_api

# Nginx
sudo systemctl reload nginx
```

### Stop Services
```bash
# Backend
pm2 stop medstargenx-backend

# ML API
sudo systemctl stop ml_api

# MongoDB
sudo systemctl stop mongod
```

## Updating the Application

```bash
cd /var/www/medstargenx
git pull origin main

# Update frontend
npm install
npm run build

# Update backend
cd backend
npm install
pm2 restart medstargenx-backend

# Update ML API
cd /var/www/medstargenx
source venv/bin/activate
cd ml_api
pip install -r requirements.txt
sudo systemctl restart ml_api
```

## Troubleshooting

### Frontend not loading
```bash
# Check Nginx config
sudo nginx -t
sudo systemctl status nginx

# Check build directory
ls -la /var/www/medstargenx/dist/
```

### Backend API errors
```bash
# Check PM2 logs
pm2 logs medstargenx-backend

# Check .env file
cat /var/www/medstargenx/backend/.env

# Check MongoDB
sudo systemctl status mongod
```

### ML API not responding
```bash
# Check service status
sudo systemctl status ml_api

# Check logs
sudo journalctl -u ml_api -f

# Check Python virtual environment
source /var/www/medstargenx/venv/bin/activate
which python
python --version
```

### Port conflicts
```bash
# Check what's using ports
sudo lsof -i :5000  # Backend
sudo lsof -i :5001  # ML API
sudo lsof -i :80    # Nginx
```

## Monitoring

### View Logs
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Backend logs
pm2 logs medstargenx-backend

# ML API logs
sudo journalctl -u ml_api -f
```

### System Resources
```bash
# CPU and Memory
htop

# Disk usage
df -h

# PM2 monitoring
pm2 monit
```

## DNS Configuration

Point your domain to the VPS IP:

**A Records:**
- `mgenx.com` → `72.62.241.114`
- `www.mgenx.com` → `72.62.241.114`

Wait for DNS propagation (usually 5-30 minutes).

## Security Checklist

- [ ] Change default MongoDB port or bind to localhost only
- [ ] Configure MongoDB authentication
- [ ] Setup SSL/TLS with Let's Encrypt
- [ ] Configure UFW firewall
- [ ] Update JWT secrets in backend .env
- [ ] Setup automated backups for MongoDB
- [ ] Enable fail2ban for SSH protection
- [ ] Regular system updates
- [ ] Monitor logs for suspicious activity

## Support

For issues or questions, please contact the development team or create an issue on GitHub.
