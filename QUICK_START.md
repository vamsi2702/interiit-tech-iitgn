# 🚀 EcoInvest - Quick Start Guide

## One-Command Startup

```bash
./start-all.sh
```

This automatically:

1. ✅ Starts Carbon-Intelligence (Docker)
2. ✅ Starts Backend API (Flask)
3. ✅ Starts Frontend (Vite)

Then open: **http://localhost:5173**

---

## One-Command Shutdown

```bash
./stop-all.sh
```

---

## Manual Startup (if needed)

### 1. Carbon-Intelligence

```bash
cd backend/carbon-intelligence
docker-compose up -d
cd ../..
```

### 2. Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

### 3. Frontend

```bash
npm run dev
```

---

## Check Status

### Backend Health

```bash
curl http://localhost:5000/api/health
```

### Get Companies

```bash
curl http://localhost:5000/api/companies
```

### Get Projects

```bash
curl http://localhost:5000/api/projects
```

### Docker Services

```bash
docker ps
```

---

## View Logs

### Backend

```bash
tail -f logs/backend.log
```

### Frontend

```bash
tail -f logs/frontend.log
```

### Docker

```bash
cd backend/carbon-intelligence
docker-compose logs -f
```

---

## Troubleshooting

### Port 5000 already in use

```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

### Docker not starting

```bash
# Clean up and restart
cd backend/carbon-intelligence
docker-compose down -v
docker-compose up -d
```

### Frontend dependencies missing

```bash
npm install socket.io-client
```

### Backend dependencies missing

```bash
cd backend
pip install -r requirements.txt
```

---

## Architecture

```
Frontend (React)
    ↓ HTTP/WebSocket
Backend (Flask)
    ↓ gRPC
Carbon-Intelligence (Docker)
    - PostgreSQL
    - Kafka
    - Scrapers
```

---

## Key URLs

| Service     | URL                              |
| ----------- | -------------------------------- |
| Frontend    | http://localhost:5173            |
| Backend API | http://localhost:5000            |
| API Health  | http://localhost:5000/api/health |
| gRPC        | localhost:50051                  |

---

## What's New

### ✅ Real-Time Data

- Companies from live stock feeds
- Projects from Verra registry
- News with sentiment analysis
- WebSocket updates every 10 seconds

### ✅ Full Integration

- Frontend fetches from backend
- Backend fetches from carbon-intelligence
- All data properly formatted
- Loading states and error handling

### ✅ Enhanced Features

- ESG scores and ratings
- Sustainability updates
- Project categories and pricing
- News sentiment analysis

---

## Next Steps

1. Start the services: `./start-all.sh`
2. Open browser: `http://localhost:5173`
3. Explore the dashboard
4. Check WebSocket connection in browser console
5. Try the projects page

---

## Support

📖 Full documentation: `INTEGRATION_COMPLETE.md`
🐛 Issues? Check logs in `logs/` directory
💡 Questions? Review the architecture in README.md
