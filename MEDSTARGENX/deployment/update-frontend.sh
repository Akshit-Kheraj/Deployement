#!/bin/bash

##############################################################################
# MEDSTARGENX Quick Update Script
# Updates the frontend on the production server
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║     🚀 MEDSTARGENX Frontend Update                    ║${NC}"
echo -e "${GREEN}║        Updating Authentication Guards                 ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
APP_DIR="/var/www/medstargenx"

# Step 1: Pull latest changes
echo -e "${YELLOW}[1/4] Pulling latest changes from repository...${NC}"
cd $APP_DIR
sudo git pull origin main

# Step 2: Rebuild Frontend
echo -e "${YELLOW}[2/4] Rebuilding frontend...${NC}"
cd $APP_DIR/MEDSTARGENX
npm install
npm run build

# Step 3: Restart Nginx
echo -e "${YELLOW}[3/4] Restarting Nginx...${NC}"
sudo nginx -t
sudo systemctl reload nginx

# Step 4: Clear browser cache recommendation
echo -e "${YELLOW}[4/4] Deployment complete!${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║     ✅ UPDATE COMPLETED SUCCESSFULLY!                  ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend:${NC} https://mgenx.com"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "1. Clear browser cache or do a hard refresh (Ctrl+Shift+R)"
echo "2. Test the authentication flow:"
echo "   - Click on 'Start Diagnosis' from home page"
echo "   - Should redirect to login immediately (no delay)"
echo ""
