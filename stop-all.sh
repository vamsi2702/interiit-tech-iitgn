#!/bin/bash

# EcoInvest Full Stack Shutdown Script
# This script stops all running services

set -e

echo "🛑 Stopping EcoInvest Full Stack"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Stop Frontend (Vite)
echo -e "${YELLOW}Stopping Frontend...${NC}"
pkill -f "vite" || echo "Frontend not running"

# Stop Backend (Flask)
echo -e "${YELLOW}Stopping Backend...${NC}"
pkill -f "flask" || pkill -f "app.py" || echo "Backend not running"

# Stop Carbon-Intelligence (Docker)
echo -e "${YELLOW}Stopping Carbon-Intelligence...${NC}"
if [ -d "backend/carbon-intelligence" ]; then
    cd backend/carbon-intelligence
    docker-compose down
    cd ../..
    echo -e "${GREEN}✅ Carbon-Intelligence stopped${NC}"
else
    echo "Carbon-Intelligence directory not found"
fi

# Clean up any stray Python processes
pkill -f "backend_analysis" 2>/dev/null || true
pkill -f "grpc_server" 2>/dev/null || true

echo ""
echo "=================================="
echo -e "${GREEN}✅ All services stopped${NC}"
echo "=================================="
echo ""
echo "💡 To start again, run: ./start-all.sh"
