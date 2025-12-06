#!/bin/bash

# EcoInvest Full Stack Startup Script
# This script starts all services in the correct order

set -e

echo "🚀 Starting EcoInvest Full Stack"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Start Carbon Intelligence Microservice
echo -e "${YELLOW}Step 1/3: Starting Carbon-Intelligence Microservice...${NC}"
cd backend/carbon-intelligence
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Start docker services
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker ps | grep -q "carbon-intelligence"; then
    echo -e "${GREEN}✅ Carbon-Intelligence microservice started${NC}"
else
    echo "❌ Error: Carbon-Intelligence failed to start"
    exit 1
fi

cd ../..

# Step 2: Install and start Backend
echo ""
echo -e "${YELLOW}Step 2/3: Starting Backend API...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing backend dependencies..."
pip install -q -r requirements.txt

# Set environment variables
export GRPC_HOST=localhost
export GRPC_PORT=50051
export KAFKA_SERVERS=localhost:9092
export FLASK_ENV=development
export FLASK_PORT=5000

# Start backend in background
echo "🚀 Starting Flask backend..."
python app.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Backend API started (PID: $BACKEND_PID)${NC}"
    echo "   API: http://localhost:5000"
    echo "   Logs: logs/backend.log"
else
    echo "❌ Error: Backend failed to start"
    exit 1
fi

cd ..

# Step 3: Install and start Frontend
echo ""
echo -e "${YELLOW}Step 3/3: Starting Frontend...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if socket.io-client is installed
if ! npm list socket.io-client > /dev/null 2>&1; then
    echo "📦 Installing socket.io-client..."
    npm install socket.io-client
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
EOF
fi

echo "🚀 Starting Vite dev server..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to be ready..."
sleep 5

# Check if frontend is running
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo "   URL: http://localhost:5173"
    echo "   Logs: logs/frontend.log"
else
    echo "❌ Error: Frontend failed to start"
    exit 1
fi

# Success!
echo ""
echo "=================================="
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo "=================================="
echo ""
echo "📍 Service URLs:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:5000"
echo "   gRPC:      localhost:50051"
echo ""
echo "📊 Process IDs:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo "   Docker:   docker-compose -f backend/carbon-intelligence/docker-compose.yml logs -f"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   cd backend/carbon-intelligence && docker-compose down"
echo ""
echo "💡 Tip: Open http://localhost:5173 in your browser"
