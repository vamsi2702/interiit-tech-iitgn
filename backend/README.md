# Carbon Intelligence Backend

**Author:** Daksh Desai  
**Last Updated:** December 5, 2025

A production-ready Flask backend with real-time data streaming for carbon credit intelligence, featuring REST API, WebSocket support, and comprehensive data analysis capabilities.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Carbon Intelligence Backend is a microservices-based system that provides real-time carbon credit market data, ESG metrics, and news analysis. It uses Pathway streaming for real-time data processing and exposes data through a Flask REST API with WebSocket support.

### Key Components

- **Flask REST API** - 15 endpoints for carbon projects, finance data, and news
- **WebSocket Server** - Real-time data streaming to connected clients
- **Pathway Processor** - Streaming data pipeline with CDC (Change Data Capture)
- **PostgreSQL Database** - Primary data storage
- **Kafka + Debezium** - Real-time event streaming
- **Redis** - Caching and session management

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Applications                       │
│                    (React, Vue, etc.)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API / WebSocket
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Flask Backend (Port 5001)                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ REST Endpoints  │  │ WebSocket Server │  │ Background Jobs│ │
│  └─────────────────┘  └──────────────────┘  └────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              Backend Analysis Service                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • get_all_projects()      • get_analytics()              │ │
│  │  • get_finance_data()      • analyze_esg_scores()         │ │
│  │  • get_news()              • analyze_carbon_trends()      │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              Pathway Data Reader (Caching Layer)                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Reads JSONL files with 10-second TTL cache:              │ │
│  │  • projects.jsonl (180MB+ carbon projects)                │ │
│  │  • finance.jsonl  (ESG & financial data)                  │ │
│  │  • news.jsonl     (news with sentiment analysis)          │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              Pathway Streaming Processor                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Consumes Kafka topics (projects, finance, news)        │ │
│  │  • Processes streaming data                               │ │
│  │  • Writes to JSONL output files                           │ │
│  │  • Provides gRPC interface                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Debezium + Kafka (CDC)                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Captures PostgreSQL changes                            │ │
│  │  • Publishes to Kafka topics                              │ │
│  │  • Real-time event streaming                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Data Sources                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  PostgreSQL  │  │   Scrapers   │  │  Redis Cache         │  │
│  │  (Port 5432) │  │  (Verra, CM) │  │  (Port 6379)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Scrapers** → Fetch data from Verra, CarbonMark, YFinance, NewsAPI
2. **PostgreSQL** → Stores scraped data in normalized tables
3. **Debezium** → Captures database changes (CDC)
4. **Kafka** → Streams change events to topics
5. **Pathway** → Processes streams, writes to JSONL files
6. **Flask Backend** → Reads JSONL files, serves via REST API
7. **Frontend** → Consumes API and WebSocket updates

---

## ✨ Features

### REST API

- **15 REST endpoints** for projects, finance, news, and analytics
- **CORS enabled** for cross-origin requests
- **Error handling** with proper HTTP status codes
- **Query parameters** for filtering and pagination

### Real-Time Features

- **WebSocket support** for live data updates
- **Background data pusher** (10-second intervals)
- **10-second cache** on JSONL file reads

### Data Analysis

- **Carbon projects** - 500+ projects from 127 countries
- **ESG metrics** - Environmental, Social, Governance scores
- **News sentiment** - Automated sentiment analysis
- **Geographic analysis** - Projects by country/category
- **Carbon trends** - Historical trend analysis

---

## 📦 Prerequisites

### Required Software

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Python** 3.10+ (for local development)
- **Git**

### System Requirements

- **RAM:** 8GB minimum (16GB recommended)
- **Storage:** 10GB free space
- **Network:** Internet connection for scrapers

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/jilsnshah/interiit-tech-iitgn.git
cd interiit-tech-iitgn/backend
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**

```env
# PostgreSQL
POSTGRES_DB=carbon_intelligence
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=carbon_postgres
POSTGRES_PORT=5432

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:29092

# Flask
FLASK_ENV=production
PORT=5000
CORS_ORIGINS=*

# Pathway
PATHWAY_OUTPUT_DIR=/app/carbon-intelligence/server/output
```

### 3. Start All Services

```bash
cd carbon-intelligence
docker-compose up -d
```

This will start 8 services:

- `carbon_postgres` - PostgreSQL database
- `zookeeper` - Kafka coordination
- `kafka` - Event streaming
- `redis` - Caching
- `debezium` - CDC connector
- `carbon_scrapers` - Data scrapers
- `carbon_pathway` - Stream processor
- `carbon_backend` - Flask API

### 4. Verify Services

```bash
# Check all services are running
docker-compose ps

# Expected output: All services should show "Up" or "Healthy"
```

### 5. Test API

```bash
# Health check
curl http://localhost:5001/health

# Get projects
curl http://localhost:5001/api/projects?limit=5

# Get analytics
curl http://localhost:5001/api/analytics
```

**API is now available at:** `http://localhost:5001`

---

## 📚 API Documentation

### Base URL

```
http://localhost:5001
```

### Health & Status

#### `GET /health`

Health check for all services.

**Response:**

```json
{
  "status": "healthy",
  "service": "carbon-intelligence-backend",
  "components": {
    "projects": "ok",
    "finance": "ok",
    "news": "ok"
  },
  "timestamp": "2025-12-05T15:26:19.364010"
}
```

---

### Projects

#### `GET /api/projects`

Get carbon credit projects with optional filters.

**Query Parameters:**

- `limit` (int) - Max projects to return (default: 500)
- `country` (string) - Filter by country
- `category` (string) - Filter by category

**Example:**

```bash
curl "http://localhost:5001/api/projects?limit=10&country=India"
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "project_id": "VCS1234",
      "project_name": "Wind Power Project",
      "country": "India",
      "category": "Renewable Energy",
      "available_credits": 50000,
      "price": 12.5
    }
  ]
}
```

#### `GET /api/project/<project_id>`

Get specific project by ID.

#### `POST /api/projects/search`

Search projects by query.

**Body:**

```json
{
  "query": "wind power",
  "limit": 50
}
```

---

### Geographic Data

#### `GET /api/countries`

Get list of countries with project counts.

**Response:**

```json
{
  "success": true,
  "count": 127,
  "data": [
    { "country": "China", "projects": 1319 },
    { "country": "India", "projects": 1245 },
    { "country": "Brazil", "projects": 331 }
  ]
}
```

#### `GET /api/categories`

Get list of project categories.

---

### Finance & ESG

#### `GET /api/finance`

Get finance and ESG data.

**Query Parameters:**

- `ticker` (string) - Filter by ticker symbol

#### `GET /api/finance/<ticker>`

Get finance data for specific ticker.

#### `POST /api/analysis/esg`

Analyze ESG scores.

**Body:**

```json
{
  "tickers": ["AAPL", "TSLA", "MSFT"]
}
```

---

### News

#### `GET /api/news`

Get news articles with sentiment.

**Query Parameters:**

- `limit` (int) - Max articles (default: 100)
- `source` (string) - Filter by source

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "title": "Carbon Market More Bullish After Alberta Agrees",
      "source": "NewsAPI",
      "sentiment": "Positive",
      "published_at": "2025-12-01T10:30:00Z"
    }
  ]
}
```

---

### Analytics

#### `GET /api/analytics`

Get comprehensive dashboard analytics.

**Response:**

```json
{
  "success": true,
  "analytics": {
    "projects": {
      "total": 500,
      "total_supply": 128114018,
      "avg_price": 11.58,
      "by_country": {...},
      "by_category": {...}
    },
    "finance": {...},
    "news": {...}
  }
}
```

#### `GET /api/analysis/carbon-trends`

Analyze carbon reduction trends.

#### `GET /api/analysis/news-sentiment`

Analyze news sentiment distribution.

---

### WebSocket

Connect to WebSocket for real-time updates:

```javascript
const socket = io("http://localhost:5001");

// Listen for updates
socket.on("data_update", (data) => {
  console.log("New data:", data);
});

// Request specific data
socket.emit("request_data", { type: "projects" });
```

**Events:**

- `data_update` - Broadcast every 10 seconds
- `projects_update` - Project data
- `finance_update` - Finance data
- `news_update` - News data
- `analytics_update` - Analytics data

---

## 📁 Project Structure

```
backend/
├── app.py                      # Flask REST API + WebSocket server
├── backend_analysis.py         # Data analysis service
├── pathway_reader.py           # JSONL file reader with caching
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Backend Docker image
├── README.md                   # This file
├── .env.example                # Environment template
│
└── carbon-intelligence/
    ├── docker-compose.yml      # Multi-service orchestration
    │
    ├── db/
    │   ├── init.sql            # Database initialization
    │   └── postgres.conf       # PostgreSQL config
    │
    ├── scrapers/
    │   ├── main.py             # Scraper orchestrator
    │   ├── verra_scraper.py    # Verra registry scraper
    │   ├── carbonmark_scraper.py # CarbonMark scraper
    │   ├── finance_scraper.py  # YFinance ESG scraper
    │   ├── news_scraper.py     # NewsAPI scraper
    │   ├── Dockerfile
    │   └── requirements.txt
    │
    ├── server/
    │   ├── grpc_server.py      # Pathway gRPC server
    │   ├── pipeline.py         # Pathway data pipeline
    │   ├── redis_cache.py      # Redis caching layer
    │   ├── schemas.py          # Data schemas
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   │
    │   ├── output/             # Pathway output files
    │   │   ├── projects.jsonl  # Carbon projects (180MB+)
    │   │   ├── finance.jsonl   # Finance/ESG data
    │   │   └── news.jsonl      # News articles
    │   │
    │   └── proto/
    │       └── carbon_service.proto  # gRPC definitions
    │
    └── debezium/
        └── connector.json      # Debezium CDC configuration
```

---

## ⚙️ Configuration

### Docker Compose Services

| Service           | Port  | Description         |
| ----------------- | ----- | ------------------- |
| `carbon_backend`  | 5001  | Flask REST API      |
| `carbon_pathway`  | 50051 | Pathway gRPC server |
| `carbon_postgres` | 5432  | PostgreSQL database |
| `kafka`           | 29092 | Kafka broker        |
| `zookeeper`       | 2181  | Kafka coordination  |
| `debezium`        | 8083  | CDC connector       |
| `redis`           | 6379  | Redis cache         |
| `carbon_scrapers` | -     | Data scrapers       |

### Environment Variables

**Flask Backend:**

```env
PORT=5000                    # Flask server port
FLASK_ENV=production         # Environment (development/production)
FLASK_DEBUG=False           # Debug mode
CORS_ORIGINS=*              # Allowed origins for CORS
PATHWAY_OUTPUT_DIR=/path    # Pathway output directory
```

**PostgreSQL:**

```env
POSTGRES_DB=carbon_intelligence
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=carbon_postgres
POSTGRES_PORT=5432
```

**Kafka:**

```env
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
ZOOKEEPER_CONNECT=zookeeper:2181
```

---

## 🛠 Development

### Local Development (Without Docker)

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Set environment variables:**

```bash
export PATHWAY_OUTPUT_DIR="./carbon-intelligence/server/output"
export PORT=5000
```

3. **Run Flask app:**

```bash
python app.py
```

### Running Individual Services

```bash
# Start only database
docker-compose up -d carbon_postgres

# Start only backend
docker-compose up -d carbon_backend

# Start scrapers
docker-compose up -d carbon_scrapers
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f carbon_backend

# Last 100 lines
docker-compose logs --tail=100 carbon_backend
```

### Rebuild Services

```bash
# Rebuild backend
docker-compose build --no-cache backend

# Rebuild all
docker-compose build --no-cache
```

---

## 🔧 Common Operations

### Start System

```bash
cd carbon-intelligence
docker-compose up -d
```

**Wait for services to be healthy (~30 seconds):**

```bash
docker-compose ps
```

### Stop System

```bash
cd carbon-intelligence
docker-compose down
```

**Stop and remove volumes (deletes all data):**

```bash
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart carbon_backend
```

### Update Code and Rebuild

```bash
# Stop services
docker-compose down

# Rebuild with latest code
docker-compose build --no-cache backend

# Start services
docker-compose up -d
```

### Check Service Health

```bash
# Check health endpoint
curl http://localhost:5001/health

# Check Docker container status
docker-compose ps

# Check logs for errors
docker-compose logs --tail=50 carbon_backend
```

### Access Container Shell

```bash
# Backend container
docker exec -it carbon_backend bash

# PostgreSQL
docker exec -it carbon_postgres psql -U postgres -d carbon_intelligence

# View Pathway output
docker exec carbon_backend ls -lh /app/carbon-intelligence/server/output/
```

### Database Operations

```bash
# Connect to PostgreSQL
docker exec -it carbon_postgres psql -U postgres -d carbon_intelligence

# View projects table
docker exec carbon_postgres psql -U postgres -d carbon_intelligence -c "SELECT COUNT(*) FROM projects;"

# Export data
docker exec carbon_postgres pg_dump -U postgres carbon_intelligence > backup.sql
```

---

## 🐛 Troubleshooting

### Service Won't Start

**Check logs:**

```bash
docker-compose logs carbon_backend
```

**Common issues:**

- **Port already in use:** Change port in `docker-compose.yml`
- **Insufficient memory:** Increase Docker memory limit
- **Missing environment variables:** Check `.env` file

### API Returns 500 Error

**Check backend logs:**

```bash
docker-compose logs --tail=100 carbon_backend
```

**Verify Pathway output files exist:**

```bash
docker exec carbon_backend ls -lh /app/carbon-intelligence/server/output/
```

**Restart backend:**

```bash
docker-compose restart carbon_backend
```

### No Data in API Response

**Verify scrapers are running:**

```bash
docker-compose logs carbon_scrapers
```

**Check database has data:**

```bash
docker exec carbon_postgres psql -U postgres -d carbon_intelligence -c "SELECT COUNT(*) FROM projects;"
```

**Verify Pathway is processing:**

```bash
docker-compose logs carbon_pathway
```

**Check file sizes:**

```bash
docker exec carbon_backend du -sh /app/carbon-intelligence/server/output/*
```

### WebSocket Not Connecting

**Check CORS settings in `.env`:**

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Verify SocketIO is running:**

```bash
docker-compose logs carbon_backend | grep -i "socket"
```

### Slow API Response

**Check cache status in logs:**

```bash
docker-compose logs carbon_backend | grep -i "cache"
```

**Reduce data volume:**

- Use `limit` parameter in API calls
- Filter by country/category
- Check file sizes in output directory

### Container Keeps Restarting

**View crash logs:**

```bash
docker logs carbon_backend
```

**Check resource usage:**

```bash
docker stats
```

**Verify dependencies:**

```bash
docker exec carbon_backend pip list
```

---

## 📊 Performance Optimization

### Caching Strategy

- **JSONL files:** 10-second TTL cache
- **Redis:** Session and API response caching (optional)
- **Database:** Indexed queries on project_id, country, category

### Recommended Settings

**For Development:**

```yaml
# docker-compose.yml
backend:
  environment:
    FLASK_ENV: development
    FLASK_DEBUG: true
```

**For Production:**

```yaml
backend:
  environment:
    FLASK_ENV: production
    FLASK_DEBUG: false
  deploy:
    resources:
      limits:
        cpus: "2"
        memory: 2G
```

---

## 🔐 Security

### Environment Variables

- Never commit `.env` files
- Use strong passwords for PostgreSQL
- Restrict CORS origins in production

### Network Security

- Backend exposed on port 5001 only
- Internal services (Kafka, Postgres) not exposed
- Use Docker networks for service isolation

### API Security (Optional Enhancements)

- Add JWT authentication
- Implement rate limiting
- Use HTTPS in production
- Add API key validation

---

## 📝 Data Schema

### Projects

```json
{
  "project_id": "VCS1234",
  "project_name": "Wind Power Project",
  "country": "India",
  "category": "Renewable Energy",
  "available_credits": 50000,
  "price": 12.5,
  "description": "...",
  "start_date": "2023-01-01",
  "end_date": "2030-12-31"
}
```

### Finance

```json
{
  "ticker": "AAPL",
  "company_name": "Apple Inc.",
  "esg_score": 85,
  "environmental_score": 90,
  "social_score": 82,
  "governance_score": 83,
  "price": 175.5,
  "change_percent": 2.5
}
```

### News

```json
{
  "title": "Carbon Market More Bullish",
  "source": "NewsAPI",
  "sentiment": "Positive",
  "url": "https://...",
  "published_at": "2025-12-01T10:30:00Z",
  "content": "..."
}
```

---

## 🤝 Contributing

**Author:** Daksh Desai

For issues, improvements, or questions:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

This project is part of the InterIIT Tech competition submission.

---

## 🔗 Related Documentation

- [Pathway Documentation](https://pathway.com/developers)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Debezium CDC](https://debezium.io/)

---

## 📞 Support

For questions or support:

- **Author:** Daksh Desai
- **Repository:** https://github.com/jilsnshah/interiit-tech-iitgn

---

**Built with ❤️ for InterIIT Tech Competition**
