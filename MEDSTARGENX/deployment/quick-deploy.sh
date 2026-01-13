#!/bin/bash

# Quick deployment script - run this on the server
cd /var/www/medstargenx
git pull origin main
cd MEDSTARGENX
npm run build

# Clear nginx cache and reload
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx

echo "✅ Deployment complete! Clear your browser cache and test."
