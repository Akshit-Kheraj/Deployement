#!/bin/bash

##############################################################################
# SSL/HTTPS Setup Script for MEDSTARGENX
# Domain: mgenx.com
# This script installs SSL certificates and enables HTTPS
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║     🔒 HTTPS/SSL Setup for MEDSTARGENX                ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

DOMAIN="mgenx.com"
APP_DIR="/var/www/medstargenx/MEDSTARGENX"

# Step 1: Install Certbot
echo -e "${YELLOW}[1/4] Installing Certbot...${NC}"
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Step 2: Obtain SSL Certificate
echo -e "${YELLOW}[2/4] Obtaining SSL certificate for ${DOMAIN}...${NC}"
echo -e "${YELLOW}Please enter your email when prompted.${NC}"
echo ""

# Run certbot
sudo certbot --nginx -d mgenx.com -d www.mgenx.com

# Step 3: Update Nginx Configuration
echo -e "${YELLOW}[3/4] Updating Nginx configuration...${NC}"

# Backup current config
sudo cp /etc/nginx/sites-available/medstargenx /etc/nginx/sites-available/medstargenx.backup

# Copy new HTTPS-enabled config
sudo cp ${APP_DIR}/deployment/nginx-https.conf /etc/nginx/sites-available/medstargenx

# Test nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
sudo nginx -t

# Step 4: Reload Nginx
echo -e "${YELLOW}[4/4] Reloading Nginx...${NC}"
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║     ✅ HTTPS ENABLED SUCCESSFULLY!                     ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🔒 Your website is now secure!${NC}"
echo -e "${GREEN}🌐 Visit: https://mgenx.com${NC}"
echo ""
echo -e "${YELLOW}Certificate Auto-Renewal:${NC}"
echo "Certbot will automatically renew your certificate every 90 days."
echo ""
echo -e "${YELLOW}Test renewal with:${NC}"
echo "sudo certbot renew --dry-run"
echo ""
