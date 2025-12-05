# Carbon Intelligence Platform# Carbon Intelligence Platform# Carbon Intelligence Platform

A real-time carbon credit intelligence system built with Change Data Capture (CDC), stream processing, and gRPC APIs. This platform continuously ingests, processes, and serves carbon credit data from multiple sources through a streaming pipeline.A real-time carbon credit intelligence system built with Change Data Capture (CDC), stream processing, and gRPC APIs. This platform continuously ingests, processes, and serves carbon credit data from multiple sources through a streaming pipeline.A real-time carbon credit intelligence system built with Change Data Capture (CDC), stream processing, and gRPC APIs. This platform continuously ingests, processes, and serves carbon credit data from multiple sources through a streaming pipeline.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)## Table of Contents[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Docker](https://img.shields.io/badge/Docker-Required-blue.svg)](https://www.docker.com/)

[![Python](https://img.shields.io/badge/Python-3.10+-green.svg)](https://www.python.org/)[![Docker](https://img.shields.io/badge/Docker-Required-blue.svg)](https://www.docker.com/)

[![gRPC](https://img.shields.io/badge/gRPC-API-orange.svg)](https://grpc.io/)

- [Overview](#overview)[![Python](https://img.shields.io/badge/Python-3.9+-green.svg)](https://www.python.org/)

## 🚀 Quick Start

- [Architecture](#architecture)[![gRPC](https://img.shields.io/badge/gRPC-API-orange.svg)](https://grpc.io/)

````bash

# Clone repository- [Quick Setup](#quick-setup)

git clone https://github.com/yourusername/carbon-intelligence.git

cd carbon-intelligence- [API Endpoints & Usage](#api-endpoints--usage)## 🚀 Quick Start



# Start all services (one command!)- [Data Flow](#data-flow)

./start.sh

- [Monitoring](#monitoring)```bash

# Wait for services to be ready (~2 minutes)

- [Troubleshooting](#troubleshooting)# Clone repository

# Test the API

python example.pygit clone https://github.com/yourusername/carbon-intelligence.git



# Run full test suite---cd carbon-intelligence

./test_docker.sh

```## Overview# Start all services (one command!)



**That's it!** Your Carbon Intelligence Platform is now running on `localhost:50051`./start.sh



## 📚 Table of Contents### What This System Does



- [Overview](#-overview)# Wait for services to be ready (~2 minutes)

- [Architecture](#️-architecture)

- [API Endpoints](#-api-endpoints)This microservice continuously collects carbon credit data from multiple sources, processes it in real-time, and serves it through a high-performance gRPC API. It uses Change Data Capture (CDC) to stream database changes through Kafka, processes them with Pathway, and caches results in Redis.

  - [Streaming Endpoints](#streaming-endpoints-real-time-data)

  - [Non-Streaming Endpoints](#non-streaming-endpoints-direct-sql)# Test the API

- [Data Flow](#-data-flow)

- [Quick Start](#-quick-start-1)### Data Sourcespython example.py

- [Testing](#-testing)

- [Configuration](#-configuration)1. **Verra Registry** - Global carbon credit projects and registry data# Run full test suite

- [Monitoring](#-monitoring)

- [Troubleshooting](#-troubleshooting)2. **Carbonmark** - Blockchain-based tokenized carbon credits (via TheGraph)./test_docker.sh



## 🌍 Overview3. **Yahoo Finance** - 47 carbon-related stock prices (KRBN, TSLA, NEE, etc.)```



This microservice ingests carbon credit data from multiple sources:4. **News RSS Feeds** - Carbon market news from Reuters, Bloomberg, The Guardian, BBC, etc.



- **Verra Registry** - Global carbon credit projects**That's it!** Your Carbon Intelligence Platform is now running on `localhost:50051`

- **Carbonmark Subgraph** - Blockchain-based carbon credits

- **Yahoo Finance** - 47 carbon-related stock tickers### Technology Stack

- **News Aggregation** - Carbon market news from major outlets

## 📚 Quick Reference

**Data Pipeline:**

- **PostgreSQL 15** - Primary database with logical replication (WAL)

````

Scrapers → PostgreSQL → Debezium → Kafka → Pathway → gRPC API → Clients- **Debezium 2.3** - Change Data Capture connector| Resource | Location |

                     ↓

              Direct SQL Access (Non-Streaming Endpoints)- **Apache Kafka 7.5.0** - Event streaming platform| --------------------- | --------------------------------------------------------------- |

```

- **Pathway 0.7.0** - Real-time stream processing| 📖 Full Documentation | See sections below |

**Key Features:**

- **gRPC** - High-performance API| 🎯 API Endpoints | [API Endpoints & Response Data](#-api-endpoints--response-data) |

- ✅ Real-time CDC via Debezium & Kafka

- ✅ Stream processing with Pathway- **Redis 7** - Response caching (5-minute TTL)| 🧪 Testing Guide | [Testing](#-testing) |

- ✅ Direct SQL database access

- ✅ Dual API modes: Streaming & Non-Streaming- **Docker** - Containerization| 🏗️ Architecture | [Architecture](#️-architecture) |

- ✅ Response caching with Redis (5-min TTL)

- ✅ Health checks for all services| 🤝 Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |

- ✅ Automated setup with dependency ordering

- ✅ Comprehensive testing (14 test cases)---| 📝 Changelog | [CHANGELOG.md](CHANGELOG.md) |

- ✅ Production-ready error handling

| ⚡ Quick Commands | [Monitoring](#-monitoring-and-observability) |

## 🏗️ Architecture

## Architecture

```

┌─────────────────────────────────────────────────────────────────────────┐## 📋 Table of Contents

│ DATA INGESTION LAYER │

├─────────────────────────────────────────────────────────────────────────┤````

│ │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │┌─────────────────────────────────────────────────────────────────┐- [Overview](#-overview)

│ │ Verra │ │ Carbonmark │ │ Finance │ │ News │ │

│ │ Scraper │ │ Scraper │ │ Scraper │ │ Scraper │ ││ DATA COLLECTION │- [Architecture](#️-architecture)

│ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬──────┘ │

│ │ │ │ │ ││ ┌──────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐ │- [Data Flow](#-data-flow)

│ └──────────────────┴──────────────────┴──────────────────┘ │

│ │ ││ │ Verra │ │ Carbonmark│ │ Finance │ │ News │ │- [Quick Start](#-quick-start)

└────────────────────────────────────┼──────────────────────────────────────┘

                                     ││  │ Scraper  │  │  Scraper  │  │ Scraper │  │ Scraper  │       │- [Testing](#-testing)

                                     ▼

                          ┌────────────────────┐│  └────┬─────┘  └─────┬─────┘  └────┬────┘  └─────┬────┘       │- [Service Endpoints](#-service-endpoints)

                          │   PostgreSQL 15    │

                          │  (WAL Replication) ││       │              │              │              │            │- [Configuration](#-configuration)

                          └─────────┬──────────┘

                                    │ WAL Stream│       └──────────────┴──────────────┴──────────────┘            │- [Data Models](#-data-models)

                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐│ ↓ │- [Technology Stack](#️-technology-stack)

│ CHANGE DATA CAPTURE LAYER │

├─────────────────────────────────────────────────────────────────────────┤└─────────────────────────────────────────────────────────────────┘- [Project Structure](#-project-structure)

│ ┌──────────────────┐ │

│ │ Debezium 2.3 │ │ ↓- [Monitoring](#-monitoring-and-observability)

│ │ CDC Connector │ │

│ └────────┬─────────┘ │ ┌──────────────────┐- [Performance](#-performance-characteristics)

│ │ CDC Events │

│ ▼ │ │ PostgreSQL │- [Production Considerations](#️-production-considerations)

│ ┌──────────────────┐ │

│ │ Kafka 7.5.0 │ │ │ (Logical WAL) │- [Additional Resources](#-additional-resources)

│ │ + Zookeeper │ │

│ └────────┬─────────┘ │ └────────┬─────────┘- [Troubleshooting](#-troubleshooting)

│ │ │

└──────────────────────────────────┼───────────────────────────────────────┘ ↓ WAL Events

                                   │ Topics:

                                   │ - carbon.public.verra                   ┌──────────────────┐## 🌍 Overview

                                   │ - carbon.public.carbonmark

                                   │ - carbon.public.finance                   │    Debezium      │

                                   │ - carbon.public.news

                                   ▼                   │  CDC Connector   │This microservice ingests carbon credit data from multiple sources:

┌─────────────────────────────────────────────────────────────────────────┐

│ STREAM PROCESSING LAYER │ └────────┬─────────┘

├─────────────────────────────────────────────────────────────────────────┤

│ ┌──────────────────────┐ │ ↓ JSON Events- **Verra Registry** - Global carbon credit projects

│ │ Pathway 0.7.0 │ │

│ │ Stream Processor │ │ ┌──────────────────┐- **Carbonmark Subgraph** - Blockchain-based carbon credits

│ │ Consumer Group: │ │

│ │ carbon*pathway* │ │ │ Kafka │- **KRBN ETF** - Carbon finance market data

│ │ consumer │ │

│ └──────────┬───────────┘ │ │ 4 CDC Topics │- **News API** - Carbon market news aggregation

│ │ Processes & Joins │

│ ▼ │ └────────┬─────────┘

│ ┌──────────────────────┐ │

│ │ Output Files │ │ ↓ Consume**Data Pipeline:**

│ │ /app/output/ │ │

│ │ - projects.jsonl │ │ ┌──────────────────┐

│ │ - news.jsonl │ │

│ └──────────┬───────────┘ │ │ Pathway │```

└──────────────────────────────────┼───────────────────────────────────────┘

                                   │                   │ Stream Processor │Scrapers → PostgreSQL → Debezium → Kafka → Pathway → Redis → gRPC API → Clients

                                   ▼

┌─────────────────────────────────────────────────────────────────────────┐ └────────┬─────────┘```

│ API LAYER │

├─────────────────────────────────────────────────────────────────────────┤ ↓ Materialized Views

│ ┌──────────────────────┐ │

│ │ gRPC Server │ │ ┌──────────────────┐**Key Features:**

│ │ Port: 50051 │ │

│ │ │ │ │ gRPC Server │

│ │ STREAMING: │ │

│ │ - GetProjects() │───┐ │ │ Port: 50051 │- ✅ Real-time CDC via Debezium & Kafka

│ │ - GetNews() │ │ Read JSONL │

│ │ - GetFinanceData() │ │ files │ └────────┬─────────┘- ✅ Stream processing with Pathway

│ │ - GetProjectDetail()│ │ │

│ │ │ │ │ ↓ Cached Responses- ✅ Response caching with Redis (5-min TTL)

│ │ NON-STREAMING: │ │ │

│ │ - GetNonStreaming │ │ │ ┌──────────────────┐- ✅ Health checks for all services

│ │ Projects() │───┤ Direct SQL │

│ │ - GetNonStreaming │ │ queries │ │ Redis │- ✅ Automated setup with dependency ordering

│ │ News() │ │ │

│ │ - GetNonStreaming │ │ │ │ 5-min TTL │- ✅ Comprehensive testing (16 test cases)

│ │ FinanceData() │ │ │

│ └──────────┬───────────┘ │ │ └──────────────────┘- ✅ Production-ready error handling

│ │ Cached │ │

│ ▼ │ │ ↓

│ ┌──────────────────────┐ │ │

│ │ Redis 7 │ │ │ Clients## 🏗️ Architecture

│ │ (5-min TTL) │ │ │

│ └──────────────────────┘ │ │````

└──────────────────────────────────────────────────┼───────────────────────┘

                                   │               │````

                                   ▼               ▼

                          ┌────────────────────────────┐### How It Works┌─────────────────────────────────────────────────────────────────────────┐

                          │   PostgreSQL (Direct)      │

                          │   Tables: verra,           ││                        DATA INGESTION LAYER                              │

                          │   carbonmark, news,        │

                          │   finance                  │1. **Scrapers** run every 60 seconds, fetching fresh data from sources├─────────────────────────────────────────────────────────────────────────┤

                          └────────────────────────────┘

````2. **PostgreSQL** stores the data with Write-Ahead Logging (WAL) enabled│                                                                           │



## 🎯 API Endpoints3. **Debezium** captures every INSERT/UPDATE/DELETE as a CDC event│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │



The system exposes **7 gRPC endpoints** in two modes:4. **Kafka** streams these events to topic partitions│  │ Verra        │  │ Carbonmark   │  │ Finance      │  │ News        │ │



### **Streaming Endpoints** (Real-time Data)5. **Pathway** consumes events, joins related data, and writes output files│  │ Scraper      │  │ Scraper      │  │ Scraper      │  │ Scraper     │ │



Process data through Pathway's stream processing pipeline for real-time updates.6. **gRPC Server** reads these files and serves API requests│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │



| Endpoint | Purpose | Latency | Use Case |7. **Redis** caches responses for 5 minutes to reduce latency│         │                  │                  │                  │        │

|----------|---------|---------|----------|

| `GetProjects` | Get carbon projects | 2-5s | Live dashboards |│         └──────────────────┴──────────────────┴──────────────────┘        │

| `GetNews` | Get carbon news | 2-5s | News feeds |

| `GetFinanceData` | Get stock prices | 2-5s | Market monitoring |---│                                    │                                      │

| `GetProjectDetail` | Get project details | 2-5s | Deep dives |

└────────────────────────────────────┼──────────────────────────────────────┘

### **Non-Streaming Endpoints** (Direct SQL)

## Quick Setup                                     │

Query PostgreSQL directly for full historical data with custom filters.

                                     ▼

| Endpoint | Purpose | Latency | Use Case |

|----------|---------|---------|----------|### Prerequisites                          ┌────────────────────┐

| `GetNonStreamingProjects` | Direct SQL projects | <100ms | Reports, analytics |

| `GetNonStreamingNews` | Direct SQL news | <100ms | Batch processing |                          │   PostgreSQL 15    │

| `GetNonStreamingFinanceData` | Direct SQL finance | <100ms | Data exports |

- Docker Desktop installed and running                          │  (WAL Replication) │

---

- At least 4GB RAM available for Docker                          └─────────┬──────────┘

## 📡 Streaming Endpoints (Real-time Data)

- Ports available: 5432, 6379, 8083, 9092, 50051                                    │ WAL Stream

### 1. GetProjects

                                    ▼

**Purpose:** Query carbon offset projects via Pathway stream processing

### Installation (One Command)┌─────────────────────────────────────────────────────────────────────────┐

**Request:**

```protobuf│                     CHANGE DATA CAPTURE LAYER                            │

message ProjectQuery {

  string country = 1;  // Optional: Filter by country```bash├─────────────────────────────────────────────────────────────────────────┤

}

```# Clone the repository│                         ┌──────────────────┐                             │



**Response:**git clone <your-repo-url>│                         │  Debezium 2.3    │                             │

```protobuf

message ProjectResponse {cd carbon-intelligence│                         │  CDC Connector   │                             │

  repeated ProjectItem items = 1;

}│                         └────────┬─────────┘                             │



message ProjectItem {# Start all services│                                  │ CDC Events                            │

  string project_id = 1;       // Unique project ID

  string project_name = 2;     // Project name./start.sh│                                  ▼                                       │

  string registry_status = 3;  // ACTIVE, RETIRED, etc.

  string country = 4;          // Project location```│                         ┌──────────────────┐                             │

  int32 vintage = 5;          // Credit vintage year

  double supply = 6;          // Available credits│                         │   Kafka 7.5.0    │                             │

}

```**That's it!** The script will:│                         │   + Zookeeper    │                             │



**Python Example:**- ✅ Check Docker is running│                         └────────┬─────────┘                             │

```python

import grpc- ✅ Build all container images│                                  │                                       │

import carbon_service_pb2 as pb2

import carbon_service_pb2_grpc as pb2_grpc- ✅ Start all services with health checks└──────────────────────────────────┼───────────────────────────────────────┘



channel = grpc.insecure_channel('localhost:50051')- ✅ Configure Debezium connector                                   │ Topics:

stub = pb2_grpc.CarbonServiceStub(channel)

- ✅ Wait for everything to be ready (~2 minutes)                                   │ - carbon.public.verra

# Get all projects

response = stub.GetProjects(pb2.ProjectQuery())                                   │ - carbon.public.carbonmark



# Filter by country### Verify Installation                                   │ - carbon.public.finance

response = stub.GetProjects(pb2.ProjectQuery(country="Brazil"))

```                                   │ - carbon.public.news



**cURL Example:**```bash                                   ▼

```bash

# All projects# Check all services are running┌─────────────────────────────────────────────────────────────────────────┐

grpcurl -plaintext localhost:50051 carbon.CarbonService/GetProjects

docker-compose ps│                    STREAM PROCESSING LAYER                               │

# Brazil only

grpcurl -plaintext -d '{"country":"Brazil"}' \├─────────────────────────────────────────────────────────────────────────┤

  localhost:50051 carbon.CarbonService/GetProjects

```# Should show all services as "healthy"│                       ┌──────────────────────┐                           │



---```│                       │   Pathway 0.7.0      │                           │



### 2. GetNews│                       │  Stream Processor    │                           │



**Purpose:** Query carbon-related news articles via Pathway stream processing### Test the API│                       │  Consumer Group:     │                           │



**Request:**│                       │  carbon_pathway_     │                           │

```protobuf

message NewsQuery {```bash│                       │  consumer            │                           │

  string source = 1;  // Optional: Filter by news source

}# Run example client│                       └──────────┬───────────┘                           │

````

python example.py│ │ Processes & Joins │

**Response:**

````protobuf│ ▼                                       │

message NewsResponse {

  repeated NewsItem items = 1;  // Max 100 items# Or run full system test│                       ┌──────────────────────┐                           │

}

./test_docker.sh│                       │   Output Files       │                           │

message NewsItem {

  string guid = 1;      // Unique identifier```│                       │  /app/output/        │                           │

  string title = 2;     // Article headline

  string link = 3;      // Full article URL│                       │  - projects.jsonl    │                           │

  string published = 4; // Publication date

  string source = 5;    // News source---│                       │  - news.jsonl        │                           │

  string summary = 6;   // Article excerpt

}│                       └──────────┬───────────┘                           │

````

## API Endpoints & Usage└──────────────────────────────────┼───────────────────────────────────────┘

**Python Example:**

```````python │

# Get all news

response = stub.GetNews(pb2.NewsQuery())The system exposes a gRPC API on `localhost:50051` with three main endpoints.                                   ▼



# Filter by source┌─────────────────────────────────────────────────────────────────────────┐

response = stub.GetNews(pb2.NewsQuery(source="Reuters"))

```### Endpoint 1: GetProjects│                         API LAYER                                        │



**cURL Example:**├─────────────────────────────────────────────────────────────────────────┤

```bash

# All news**Purpose:** Query carbon offset projects from Verra and Carbonmark│                       ┌──────────────────────┐                           │

grpcurl -plaintext localhost:50051 carbon.CarbonService/GetNews

│                       │   gRPC Server        │                           │

# Reuters only

grpcurl -plaintext -d '{"source":"Reuters"}' \**Request Format:**│                       │   Port: 50051        │                           │

  localhost:50051 carbon.CarbonService/GetNews

``````protobuf│                       │                      │                           │



---message ProjectQuery {│                       │  Methods:            │                           │



### 3. GetFinanceData  string country = 1;  // Optional: Filter by country (case-sensitive)│                       │  - GetProjects()     │                           │



**Purpose:** Query carbon-related stock prices via Pathway stream processing}│                       │  - GetNews()         │                           │



**Request:**```│                       └──────────┬───────────┘                           │

```protobuf

message FinanceQuery {│                                  │ Cached                                │

  string ticker = 1;  // Optional: Filter by ticker symbol

}**Response Format:**│                                  ▼                                       │

```````

`````protobuf│ ┌──────────────────────┐                           │

**Response:**

```protobufmessage ProjectResponse {│                       │   Redis 7            │                           │

message FinanceResponse {

  repeated FinanceItem items = 1;  repeated ProjectItem items = 1;│                       │   (5-min TTL)        │                           │

  int32 count = 2;

}}│                       └──────────────────────┘                           │



message FinanceItem {└─────────────────────────────────────────────────────────────────────────┘

  string ticker = 1;

  double price = 2;message ProjectItem {                                   │

  int64 volume = 3;

  double market_cap = 4;  string project_id = 1;       // Unique project identifier                                   ▼

  double change_percent = 5;

  int64 timestamp = 6;  string project_name = 2;     // Name of the carbon project                          ┌────────────────────┐

}

```  string registry_status = 3;  // ACTIVE, RETIRED, UNDER_VALIDATION                          │   Client Apps      │



**Tracked Tickers:** 47 companies including KRBN, TSLA, NEE, ENPH, FSLR, LIN, APD, and more.  string country = 4;          // Project location                          └────────────────────┘



**Python Example:**  int32 vintage = 5;          // Year of carbon credit vintage```

```python

# Get all finance data  double supply = 6;          // Available credits (metric tons CO2e)

response = stub.GetFinanceData(pb2.FinanceQuery())

}## 🔄 Data Flow

# Filter by ticker

response = stub.GetFinanceData(pb2.FinanceQuery(ticker="KRBN"))````

`````

### 1. Data Ingestion (Scrapers Layer)

---

**What You Get:**

### 4. GetProjectDetail

Four specialized scrapers continuously collect data:

**Purpose:** Get detailed information for a specific carbon project

| Field | Description | Example |

**Request:**

`````protobuf|-------|-------------|---------|**Verra Scraper** (Every 60s)

message ProjectDetailQuery {

  string project_id = 1;  // Required: Project ID| `project_id` | Unique Verra registry ID | "VCS-1234" |

}

```| `project_name` | Official project name | "Amazon Rainforest Conservation" |- Source: https://registry.verra.org



**Response:**| `registry_status` | Current project status | "ACTIVE" |- Data: Project details, registry status, country, vintage, credit supply

```protobuf

message ProjectDetailResponse {| `country` | Where the project is located | "Brazil" |

  ProjectDetail project = 1;

}| `vintage` | Year credits were generated | 2024 |**Carbonmark Scraper** (Every 60s)



message ProjectDetail {| `supply` | Available carbon credits | 50000.0 (metric tons CO2e) |

  string project_id = 1;

  string project_name = 2;- Source: TheGraph (Polygon & Ethereum subgraphs)

  string project_link = 3;

  string project_summary = 4;**Usage Examples:**- Data: Tokenized carbon credits, vintages, supply data

  string registry_status = 5;

  string country = 6;**Python:\*\***Finance Scraper\*\* (Every 60s)

  int32 vintage = 7;

  double supply = 8;````python

  string source = 9;

}import grpc- Source: Yahoo Finance API

`````

import carbon_service_pb2 as pb2- Data: Real-time stock prices for 43 carbon-related tickers (KRBN, TSLA, NEE, etc.)

---

import carbon_service_pb2_grpc as pb2_grpc

## 💾 Non-Streaming Endpoints (Direct SQL)

**News Scraper** (Every 60s)

These endpoints query PostgreSQL directly, bypassing Pathway for full historical data access.

# Connect to server

### 5. GetNonStreamingProjects

channel = grpc.insecure_channel('localhost:50051')- Sources: RSS feeds from major news outlets

**Purpose:** Query projects directly from database

stub = pb2_grpc.CarbonServiceStub(channel)- Keywords: Carbon credits, net zero, emissions trading

**Key Differences from Streaming:**

- ✅ Accesses full historical database- Data: Headlines, summaries, publication dates

- ✅ No Pathway processing delay

- ✅ Custom SQL queries possible# Get all projects

- ✅ Ideal for batch operations

response = stub.GetProjects(pb2.ProjectQuery())All scrapers write directly to PostgreSQL tables: `verra`, `carbonmark`, `finance`, `news`

**Request/Response:** Same as `GetProjects`

print(f"Found {len(response.items)} projects")

**SQL Query:**

````sql### 2. Change Data Capture (CDC Layer)

SELECT DISTINCT ON (v.project_id)

    v.project_id,for project in response.items:

    COALESCE(c.project_name, v.project_name) as project_name,

    v.registry_status,    print(f"Project: {project.project_name}")**PostgreSQL Configuration:**

    v.country,

    v.vintage,    print(f"Country: {project.country}")

    v.supply

FROM verra v    print(f"Supply: {project.supply:,.0f} credits")- WAL (Write-Ahead Logging) enabled with `logical` replication

LEFT JOIN carbonmark c ON v.project_id = c.project_id

WHERE v.country = ? OR ? IS NULL    print(f"Status: {project.registry_status}")- Every INSERT/UPDATE/DELETE generates a WAL event

ORDER BY v.project_id, v.updated_at DESC

```    print("-" * 50)- Replication slot: `debezium`



**Python Example:**

```python

# Get all projects from database# Get only Brazilian projects**Debezium Connector:**

response = stub.GetNonStreamingProjects(pb2.ProjectQuery())

brazil_response = stub.GetProjects(pb2.ProjectQuery(country="Brazil"))

# Filter by country

response = stub.GetNonStreamingProjects(pb2.ProjectQuery(country="Brazil"))print(f"Found {len(brazil_response.items)} projects in Brazil")- Monitors PostgreSQL's replication slot

````

````- Converts WAL events into structured JSON messages

**Performance:**

- Response time: 50-100ms (uncached)- Publishes to Kafka topics with schema information

- Cache TTL: 5 minutes

- Data: Full database history**cURL (using grpcurl):**- Topic naming: `carbon.public.<table_name>`



---```bash



### 6. GetNonStreamingNews# Get all projects**Kafka Cluster:**



**Purpose:** Query news directly from databasegrpcurl -plaintext localhost:50051 carbon.CarbonService/GetProjects



**Request/Response:** Same as `GetNews`- 4 topics streaming CDC events in real-time



**SQL Query:**# Get projects from Brazil- Zookeeper manages cluster coordination

```sql

SELECT guid, title, link, published, source, summarygrpcurl -plaintext -d '{"country":"Brazil"}' \- Events include operation type (CREATE, UPDATE, DELETE)

FROM news

WHERE source = ? OR ? IS NULL  localhost:50051 carbon.CarbonService/GetProjects- Full row data captured in `after` field

ORDER BY published DESC

LIMIT 100

````

# Get projects from India### 3. Stream Processing (Pathway Layer)

**Python Example:**

`````pythongrpcurl -plaintext -d '{"country":"India"}' \

# Get all news from database

response = stub.GetNonStreamingNews(pb2.NewsQuery())  localhost:50051 carbon.CarbonService/GetProjects**Pathway Consumer:**



# Filter by source````

response = stub.GetNonStreamingNews(pb2.NewsQuery(source="Reuters"))

```- Consumer Group ID: `carbon_pathway_consumer`



**Performance:****Example Response:**- Subscribes to all 4 Kafka CDC topics

- Response time: 40-80ms (uncached)

- Returns up to 100 most recent articles```json- Auto offset reset: `earliest` (processes all historical data)



---{



### 7. GetNonStreamingFinanceData"items": [**Stream Operations:**



**Purpose:** Query finance data directly from database    {



**Request/Response:** Same as `GetFinanceData`      "project_id": "VCS-934",1. **Read**: Consumes CDC events using `pw.io.debezium.read()`



**SQL Query:**      "project_name": "Amazon Rainforest Conservation",2. **Select**: Extracts relevant fields from each stream

```sql

SELECT DISTINCT ON (ticker)      "registry_status": "ACTIVE",3. **Join**: Combines `carbonmark` + `verra` streams on `project_id`

    ticker, price, volume, market_cap, change_percent, timestamp

FROM finance      "country": "Brazil",4. **Write**: Materializes streams to output files

WHERE ticker = ? OR ? IS NULL

ORDER BY ticker, timestamp DESC      "vintage": 2024,   - `projects.jsonl`: Unified carbon credit projects

`````

      "supply": 50000.0   - `news.jsonl`: Latest carbon market news

**Python Example:**

`````python },

# Get all finance data from database

response = stub.GetNonStreamingFinanceData(pb2.FinanceQuery())    {**Output Format:**



# Filter by ticker      "project_id": "VCS-1067",

response = stub.GetNonStreamingFinanceData(pb2.FinanceQuery(ticker="KRBN"))

```      "project_name": "Wind Energy Project",```jsonl



---      "registry_status": "ACTIVE",{



## 📊 Streaming vs Non-Streaming Comparison      "country": "India",  "project_id": "PROJ-001",



| Aspect | Streaming (Pathway) | Non-Streaming (Direct SQL) |      "vintage": 2023,  "project_name": "Solar Farm",

|--------|---------------------|---------------------------|

| **Latency** | 2-5 seconds from DB change | <100ms query time |      "supply": 25000.0  "country": "Brazil",

| **Data Source** | Pathway JSONL files | PostgreSQL tables |

| **Processing** | Kafka CDC → Pathway → JSONL | Direct SQL query |    }  "vintage": 2025,

| **Use Case** | Real-time dashboards, alerts | Reports, analytics, exports |

| **Data Freshness** | Near real-time (2-5s delay) | Instant (current DB state) |] "supply": 50000,

| **Complexity** | Stream joins, transformations | Simple SQL queries |

| **Cache Key** | `projects:ALL`, `news:Reuters` | `nonstreaming_projects:Brazil` |} "diff": 1,

| **Best For** | Live monitoring | Batch processing |

````"time": 1764806270526

**When to Use Streaming:**

- Real-time dashboards showing live updates}

- Event-driven applications

- Monitoring alerts and triggers**Performance:**```

- Applications needing processed/joined data

- Cached: ~10ms response time

**When to Use Non-Streaming:**

- Generating reports and analytics- Uncached: ~100ms response timeThe `diff` field indicates: `1` = new/updated, `-1` = deleted

- Batch data exports

- Historical data analysis- Cache TTL: 5 minutes

- Custom queries with specific filters

- Data freshness: Updated every 60 seconds### 4. API Layer (gRPC Server)

---



## 🔄 Data Flow

---**Server Initialization:**

### 1. Data Ingestion (Scrapers Layer)



Four specialized scrapers continuously collect data:

### Endpoint 2: GetNews- Starts Pathway runtime in background thread

**Verra Scraper** (Every 60s)

- Source: https://registry.verra.org- Waits 5 seconds for initial data materialization

- Data: Project details, registry status, country, vintage, credit supply

**Purpose:** Query carbon-related news articles from multiple sources- Launches gRPC server on port `50051`

**Carbonmark Scraper** (Every 60s)

- Source: TheGraph (Polygon & Ethereum subgraphs)

- Data: Tokenized carbon credits, vintages, supply data

**Request Format:****API Methods:**

**Finance Scraper** (Every 60s)

- Source: Yahoo Finance API```protobuf

- Data: Real-time stock prices for 47 carbon-related tickers

message NewsQuery {`GetProjects(ProjectQuery) → ProjectResponse`

**News Scraper** (Every 60s)

- Sources: RSS feeds from major news outlets  string source = 1;  // Optional: Filter by news source (case-sensitive)

- Keywords: Carbon credits, net zero, emissions trading

- Data: Headlines, summaries, publication dates}- Reads `/app/output/projects.jsonl`



All scrapers write directly to PostgreSQL tables: `verra`, `carbonmark`, `finance`, `news````- Supports filtering by `country`



### 2. Change Data Capture (CDC Layer)- Returns: project_id, project_name, registry_status, country, vintage, supply



**PostgreSQL Configuration:****Response Format:**- Cached in Redis for 5 minutes

- WAL (Write-Ahead Logging) enabled with `logical` replication

- Every INSERT/UPDATE/DELETE generates a WAL event```protobuf

- Replication slot: `debezium`

message NewsResponse {`GetNews(NewsQuery) → NewsResponse`

**Debezium Connector:**

- Monitors PostgreSQL's replication slot  repeated NewsItem items = 1;  // Maximum 100 items

- Converts WAL events into structured JSON messages

- Publishes to Kafka topics with schema information}- Reads `/app/output/news.jsonl`

- Topic naming: `carbon.public.<table_name>`

- Supports filtering by `source`

**Kafka Cluster:**

- 4 topics streaming CDC events in real-timemessage NewsItem {- Limits to 100 most recent items

- Zookeeper manages cluster coordination

- Events include operation type (CREATE, UPDATE, DELETE)  string guid = 1;      // Unique article identifier- Returns: guid, title, link, published, source, summary

- Full row data captured in `after` field

  string title = 2;     // Article headline- Cached in Redis for 5 minutes

### 3. Stream Processing (Pathway Layer)

  string link = 3;      // Full article URL

**Pathway Consumer:**

- Consumer Group ID: `carbon_pathway_consumer`  string published = 4; // Publication date (RFC 822 format)**Caching Strategy:**

- Subscribes to all 4 Kafka CDC topics

- Auto offset reset: `earliest` (processes all historical data)  string source = 5;    // Publisher/news source



**Stream Operations:**  string summary = 6;   // Article excerpt or description- Cache key format: `<type>:<filter>` (e.g., `projects:Brazil` or `news:ALL`)

1. **Read**: Consumes CDC events using `pw.io.debezium.read()`

2. **Select**: Extracts relevant fields from each stream}- TTL: 300 seconds (5 minutes)

3. **Join**: Combines `carbonmark` + `verra` streams on `project_id`

4. **Write**: Materializes streams to output files```- Automatic cache invalidation on expiry

   - `projects.jsonl`: Unified carbon credit projects

   - `news.jsonl`: Latest carbon market news



**Output Format:****What You Get:**### 5. Real-Time Characteristics

```jsonl

{

  "project_id": "PROJ-001",

  "project_name": "Solar Farm",| Field | Description | Example |**End-to-End Latency:** 2-5 seconds

  "country": "Brazil",

  "vintage": 2025,|-------|-------------|---------|

  "supply": 50000,

  "diff": 1,| `guid` | Unique identifier (hash) | "4a48dad0640e23b4531504" |```

  "time": 1733328000526

}| `title` | Article headline | "Carbon market reaches $2B in Q4" |T+0.0s: INSERT INTO verra (project_id='PROJ-NEW', ...)

`````

| `link` | URL to full article | "https://reuters.com/article/..." |T+0.1s: PostgreSQL commits transaction

The `diff` field indicates: `1` = new/updated, `-1` = deleted

| `published` | Publication timestamp | "Wed, 29 Nov 2025 09:15:00 GMT" |T+0.6s: Debezium publishes to Kafka topic

### 4. API Layer (gRPC Server)

| `source` | News publisher | "Reuters" |T+0.8s: Pathway consumer receives event

**Server Initialization:**

- Starts Pathway runtime in background thread| `summary` | Article excerpt | "The voluntary carbon market has..." |T+2.8s: projects.jsonl file updated

- Waits 5 seconds for initial data materialization

- Launches gRPC server on port `50051`T+2.9s: GetProjects() returns new data (if cache expired)

**API Methods (Streaming):\*\***Available News Sources:\*\*```

`GetProjects(ProjectQuery) → ProjectResponse`- Reuters

- Reads `/app/output/projects.jsonl`

- Supports filtering by `country`- Bloomberg## 🚀 Quick Start

- Returns: project_id, project_name, registry_status, country, vintage, supply

- Cached in Redis for 5 minutes- The Guardian

**API Methods (Non-Streaming):**- BBC### Prerequisites

`GetNonStreamingProjects(ProjectQuery) → ProjectResponse`- Financial Times

- Queries PostgreSQL directly using psycopg2

- Executes SQL: `SELECT FROM verra LEFT JOIN carbonmark`- CNBC- Docker Desktop installed and running

- Supports same filters as streaming version

- Cached in Redis for 5 minutes- Associated Press- At least 4GB RAM available for Docker

**Caching Strategy:**- And more...- Git for cloning the repository

- Cache key format: `<type>:<filter>` (e.g., `projects:Brazil` or `news:ALL`)

- TTL: 300 seconds (5 minutes)

- Automatic cache invalidation on expiry

**Usage Examples:**### One-Command Setup

### 5. Real-Time Characteristics

**End-to-End Latency:** 2-5 seconds

**Python:**```bash

````

T+0.0s: INSERT INTO verra (project_id='PROJ-NEW', ...)```python./start.sh

T+0.1s: PostgreSQL commits transaction

T+0.6s: Debezium publishes to Kafka topicimport grpc```

T+0.8s: Pathway consumer receives event

T+2.8s: projects.jsonl file updatedimport carbon_service_pb2 as pb2

T+2.9s: GetProjects() returns new data (if cache expired)

```import carbon_service_pb2_grpc as pb2_grpcThis automated script will:



---



## 🚀 Quick Startchannel = grpc.insecure_channel('localhost:50051')1. ✅ Verify Docker is running



### Prerequisitesstub = pb2_grpc.CarbonServiceStub(channel)2. ✅ Create environment configuration



- Docker Desktop installed and running3. ✅ Build all services

- At least 4GB RAM available for Docker

- Git for cloning the repository# Get all news (latest 100 articles)4. ✅ Start services with health checks



### One-Command Setupresponse = stub.GetNews(pb2.NewsQuery())5. ✅ Set up Debezium connector automatically



```bashprint(f"Found {len(response.items)} news articles")6. ✅ Wait for all services to be ready

./start.sh

````

This automated script will:for article in response.items[:5]: # Show first 5**Setup time:** ~2 minutes (first build: 5-10 minutes)

1. ✅ Verify Docker is running print(f"Title: {article.title}")

2. ✅ Create environment configuration

3. ✅ Build all services print(f"Source: {article.source}")### Manual Setup

4. ✅ Start services with health checks

5. ✅ Set up Debezium connector automatically print(f"Published: {article.published}")

6. ✅ Wait for all services to be ready

   print(f"Link: {article.link}")If you prefer manual control:

**Setup time:** ~2 minutes (first build: 5-10 minutes)

    print(f"Summary: {article.summary[:100]}...")

### Manual Setup

    print("-" * 70)**1. Start Services**

If you prefer manual control:

**1. Start Services**

`bash# Get only Reuters articles`bash

docker-compose up -d --build

````reuters_response = stub.GetNews(pb2.NewsQuery(source="Reuters"))docker-compose up -d --build



**2. Check Status**print(f"Found {len(reuters_response.items)} Reuters articles")```

```bash

docker-compose ps

````

# Get only BBC articles**2. Check Status**

All services should show "healthy" status.

bbc_response = stub.GetNews(pb2.NewsQuery(source="BBC"))

**3. Configure Debezium** (after ~30 seconds)

`bashprint(f"Found {len(bbc_response.items)} BBC articles")`bash

curl -X POST http://localhost:8083/connectors \

-H "Content-Type: application/json" \```docker-compose ps

-d @debezium/connector.json

````````



---**cURL (using grpcurl):**



## 🧪 Testing````bashAll services should show "healthy" status.



Run the comprehensive test suite:# Get all news



```bashgrpcurl -plaintext localhost:50051 carbon.CarbonService/GetNews**3. Generate gRPC Code (if proto file was modified)**

cd server

pip install -r requirements.txt

python full_system_test_docker.py

```# Get Reuters news only```bash



**Test Coverage:** 14 test cases across 5 phasesgrpcurl -plaintext -d '{"source":"Reuters"}' \# Option A: Using helper script (recommended)



- ✅ Infrastructure (PostgreSQL, Kafka, Redis)  localhost:50051 carbon.CarbonService/GetNewschmod +x regenerate_grpc.sh

- ✅ Data Layer (scrapers, insertions)

- ✅ CDC Pipeline (Debezium, Kafka streaming)./regenerate_grpc.sh

- ✅ gRPC Service (endpoints, caching)

- ✅ End-to-End Integration# Get The Guardian news only



**Expected Output:**grpcurl -plaintext -d '{"source":"The Guardian"}' \# Option B: Manual command

```

========================================  localhost:50051 carbon.CarbonService/GetNewsdocker exec carbon_pathway python -m grpc_tools.protoc \

CARBON INTELLIGENCE SYSTEM TESTS

========================================```  -I=/app/proto \



Running 14 comprehensive tests...  --python_out=/app \



✅ Test 1/14: PostgreSQL connection**Example Response:**  --grpc_python_out=/app \

✅ Test 2/14: Verra table exists

...```json  /app/proto/carbon_service.proto

✅ Test 14/14: End-to-end data flow

{

========================================

ALL TESTS PASSED! ✨  "items": [# Restart the container to load new code

========================================

```    {docker-compose restart carbon_pathway



### Quick API Test      "guid": "abc123def456",```



```bash      "title": "New carbon credit framework adopted at COP30",

# Using example script

docker cp example.py carbon_pathway:/app/      "link": "https://reuters.com/business/environment/cop30-carbon-framework-2025-11-29/",**4. Configure Debezium** (after ~30 seconds)

docker exec carbon_pathway python /app/example.py

      "published": "Wed, 29 Nov 2025 14:30:00 GMT",

# Using grpcurl

grpcurl -plaintext localhost:50051 carbon.CarbonService/GetProjects      "source": "Reuters",```bash

```

      "summary": "Global leaders have agreed on a new standardized carbon credit framework at the COP30 summit in Brazil, marking a significant step toward unified climate action..."curl -X POST http://localhost:8083/connectors \

---

    },  -H "Content-Type: application/json" \

## 📊 Service Endpoints

    {  -d @debezium/connector.json

| Service     | Endpoint                | Description               |

| ----------- | ----------------------- | ------------------------- |      "guid": "xyz789ghi012",```

| PostgreSQL  | `localhost:5432`        | Database                  |

| Kafka       | `localhost:29092`       | Message broker (external) |      "title": "Carbon offset market reaches $2B in Q4",

| Debezium    | `http://localhost:8083` | CDC connector             |

| Redis       | `localhost:6379`        | Cache                     |      "link": "https://bloomberg.com/news/articles/carbon-market-growth-q4",## 🧪 Testing

| gRPC Server | `localhost:50051`       | API endpoint              |

      "published": "Wed, 29 Nov 2025 09:15:00 GMT",

---

      "source": "Bloomberg",Run the comprehensive test suite:

## 🔧 Configuration

      "summary": "The voluntary carbon market has seen unprecedented growth in Q4 2025, with total transactions exceeding $2 billion..."

### Environment Setup

    }```bash

Copy the environment template:

  ]cd server

```bash

cp .env.example .env}pip install -r requirements.txt

```

```python full_system_test.py

Edit `.env` to customize:

- Database credentials````

- Service ports

- API keys (if needed)**Performance:**



### Scraper Frequency- Cached: ~10ms response time**Test Coverage:** 16 test cases across 5 phases



Edit `scrapers/main.py`:- Uncached: ~80ms response time



```python- Cache TTL: 5 minutes- ✅ Infrastructure (PostgreSQL, Kafka, Redis)

# Change from 60 seconds to desired interval

time.sleep(60)  # ← Modify this value- Maximum items: 100 (most recent)- ✅ Data Layer (scrapers, insertions)

```

- Data freshness: Updated every 60 seconds- ✅ CDC Pipeline (Debezium, Kafka streaming)

### Cache TTL

- ✅ gRPC Service (endpoints, caching)

Edit `server/redis_cache.py`:

---- ✅ End-to-End Integration

```python

def cache_set(key, value):### Endpoint 3: GetFinanceData**Expected Output:**

    r.set(key, json.dumps(value), ex=300)  # ← Change 300 (5 minutes)

```**Purpose:** Query real-time stock prices for carbon-related companies```



---========================================



## 🔍 Monitoring**Request Format:**CARBON INTELLIGENCE SYSTEM TESTS



### Check Service Status````protobuf========================================



```bashmessage FinanceQuery {

# View all containers

docker-compose ps  string ticker = 1;  // Optional: Filter by stock ticker symbolRunning 16 comprehensive tests...



# Should show all services as "healthy"}

```

```✅ Test 1/16: PostgreSQL connection

### View Logs

✅ Test 2/16: Verra table exists

```bash

# All services**Response Format:**...

docker-compose logs -f

```protobuf✅ Test 16/16: End-to-end data flow

# Specific service

docker logs carbon_scrapers -fmessage FinanceResponse {

docker logs carbon_pathway -f

  repeated FinanceItem items = 1;========================================

# Last 100 lines

docker logs carbon_scrapers --tail 100}ALL TESTS PASSED! ✨

```

========================================

### Monitor Data Flow

message FinanceItem {```

**Check Database:**

```bash  string ticker = 1;   // Stock ticker symbol

# Connect to PostgreSQL

docker exec -it carbon_postgres psql -U carbon -d carbon_intel  double price = 2;    // Current price in USD### Quick API Test



# Count records  int64 timestamp = 3; // Unix timestamp (seconds since epoch)

SELECT COUNT(*) FROM verra;

SELECT COUNT(*) FROM carbonmark;}```bash

SELECT COUNT(*) FROM finance;

SELECT COUNT(*) FROM news;```# Using example script



# View recent datadocker cp example.py carbon_pathway:/app/

SELECT * FROM news ORDER BY published DESC LIMIT 5;

```**What You Get:**docker exec carbon_pathway python /app/example.py



**Check Kafka Topics:**

```bash

# List all topics| Field | Description | Example |# Using grpcurl

docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list

|-------|-------------|---------|grpcurl -plaintext localhost:50051 carbon.CarbonService/GetProjects

# Should show:

# carbon.public.verra| `ticker` | Stock symbol | "KRBN" |```

# carbon.public.carbonmark

# carbon.public.finance| `price` | Current price (USD) | 42.50 |

# carbon.public.news

```| `timestamp` | Last update time | 1733328000 (Unix timestamp) |## 📊 Service Endpoints



**Check Redis Cache:**

```bash

# Connect to Redis**Tracked Stocks (47 total):**| Service     | Endpoint                | Description               |

docker exec -it redis redis-cli

| ----------- | ----------------------- | ------------------------- |

# List all cache keys

KEYS ***Carbon ETFs:**| PostgreSQL  | `localhost:5432`        | Database                  |



# View cached data- KRBN - KraneShares Global Carbon Strategy ETF| Kafka       | `localhost:29092`       | Message broker (external) |

GET "projects:ALL"

GET "nonstreaming_news:Reuters"- KCCA - KraneShares California Carbon Allowance ETF| Debezium    | `http://localhost:8083` | CDC connector             |



# Check TTL| Redis       | `localhost:6379`        | Cache                     |

TTL "projects:ALL"

```**Clean Energy Leaders:**| gRPC Server | `localhost:50051`       | API endpoint              |



---- TSLA - Tesla Inc



## 🚨 Troubleshooting- NEE - NextEra Energy## 🎯 API Endpoints & Response Data



### Issue: Services won't start- ENPH - Enphase Energy



**Check Docker:**- FSLR - First Solar Inc### Overview

```bash

# Ensure Docker is running- SEDG - SolarEdge Technologies

docker info

The Carbon Intelligence Platform exposes a gRPC API with three main endpoints. All responses are cached in Redis with a 5-minute TTL for optimal performance.

# Check available resources

docker system df**Renewable Energy:**



# If needed, clean up- BEP - Brookfield Renewable Partners### 1. GetProjects - Query Carbon Offset Projects

docker system prune -a

```- AQN - Algonquin Power & Utilities



**Solution:**- CWEN - Clearway Energy**Endpoint:** `carbon.CarbonService/GetProjects`

```bash

# Stop everything

docker-compose down -v

**Carbon Capture & Industrial:****Request Message:**

# Rebuild and restart

docker-compose up -d --build- LIN - Linde plc

```

- APD - Air Products and Chemicals```protobuf

### Issue: Debezium connector not working

message ProjectQuery {

**Check status:**

```bash**Electric Vehicles:**  string country = 1;  // Optional: Filter by country name

curl http://localhost:8083/connectors/postgres-connector/status

```- NIO - NIO Inc}



**If connector doesn't exist:**- XPEV - XPeng Inc```

```bash

# Wait 30 seconds after startup, then:- LI - Li Auto Inc

curl -X POST http://localhost:8083/connectors \

  -H "Content-Type: application/json" \**Response Message:**

  -d @debezium/connector.json

```**And 32 more carbon-related companies...**



### Issue: No data in API responses```protobuf



**Check Pathway output:****Usage Examples:**message ProjectResponse {

```bash

# Check if files exist and have data  repeated ProjectItem items = 1;

docker exec carbon_pathway ls -lh /app/output/

docker exec carbon_pathway head /app/output/projects.jsonl**Python:**}



# If empty, check Pathway logs```python

docker logs carbon_pathway -f

```import grpcmessage ProjectItem {



**Check Database:**import carbon_service_pb2 as pb2  string project_id = 1;       // Unique project identifier

```bash

docker exec carbon_postgres psql -U carbon -d carbon_intel \import carbon_service_pb2_grpc as pb2_grpc  string project_name = 2;     // Name of the carbon project

  -c "SELECT COUNT(*) FROM news;"

from datetime import datetime  string registry_status = 3;  // Status: ACTIVE, RETIRED, etc.

# If 0, scrapers may be failing

docker logs carbon_scrapers -f  string country = 4;          // Project location

```

channel = grpc.insecure_channel('localhost:50051')  int32 vintage = 5;          // Year of carbon credit vintage

### Issue: High latency

stub = pb2_grpc.CarbonServiceStub(channel)  double supply = 6;          // Available carbon credits

**Check cache:**

```bash}

docker exec redis redis-cli

> KEYS *# Get all finance data```

> TTL "projects:ALL"

response = stub.GetFinanceData(pb2.FinanceQuery())

# If cache is empty, responses will be slower

```print(f"Found {len(response.items)} stocks")**Example Request (Python):**



---



## 📝 Complete Integration Examplefor stock in response.items[:10]:  # Show first 10```python



```python    timestamp = datetime.fromtimestamp(stock.timestamp)import grpc

#!/usr/bin/env python3

"""Complete example of using both streaming and non-streaming endpoints"""    print(f"{stock.ticker:6} | ${stock.price:8.2f} | {timestamp}")import carbon_service_pb2 as pb2



import grpcimport carbon_service_pb2_grpc as pb2_grpc

import carbon_service_pb2 as pb2

import carbon_service_pb2_grpc as pb2_grpc# Get specific stock



def main():krbn_response = stub.GetFinanceData(pb2.FinanceQuery(ticker="KRBN"))channel = grpc.insecure_channel('localhost:50051')

    # Connect to server

    channel = grpc.insecure_channel('localhost:50051')if krbn_response.items:stub = pb2_grpc.CarbonServiceStub(channel)

    stub = pb2_grpc.CarbonServiceStub(channel)

        krbn = krbn_response.items[0]

    # ============================================================

    # STREAMING ENDPOINTS (Pathway-processed real-time data)    print(f"\nKRBN Carbon ETF: ${krbn.price:.2f}")# Get all projects

    # ============================================================

    response = stub.GetProjects(pb2.ProjectQuery())

    print("="*70)

    print("STREAMING: GetProjects (via Pathway)")# Get Tesla price

    print("="*70)

    tsla_response = stub.GetFinanceData(pb2.FinanceQuery(ticker="TSLA"))# Filter by country

    projects = stub.GetProjects(pb2.ProjectQuery())

    print(f"Found {len(projects.items)} projects from Pathway stream")if tsla_response.items:response = stub.GetProjects(pb2.ProjectQuery(country="Brazil"))



    # ============================================================    tsla = tsla_response.items[0]```

    # NON-STREAMING ENDPOINTS (Direct SQL queries)

    # ============================================================    print(f"Tesla: ${tsla.price:.2f}")



    print("\n" + "="*70)```**Example Response Data:**

    print("NON-STREAMING: GetNonStreamingProjects (Direct SQL)")

    print("="*70)



    db_projects = stub.GetNonStreamingProjects(pb2.ProjectQuery())**cURL (using grpcurl):**```json

    print(f"Found {len(db_projects.items)} projects from database")

    ```bash{

    for p in db_projects.items[:3]:

        print(f"  • {p.project_name} ({p.country}) - {p.supply:,.0f} credits")# Get all finance data  "items": [



    # Filter by countrygrpcurl -plaintext localhost:50051 carbon.CarbonService/GetFinanceData    {

    print("\n" + "="*70)

    print("NON-STREAMING: Projects in Brazil (Direct SQL)")      "project_id": "VCS-1234",

    print("="*70)

    # Get KRBN ETF price      "project_name": "Amazon Rainforest Conservation",

    brazil = stub.GetNonStreamingProjects(pb2.ProjectQuery(country="Brazil"))

    print(f"Found {len(brazil.items)} projects in Brazil")grpcurl -plaintext -d '{"ticker":"KRBN"}' \      "registry_status": "ACTIVE",



    # Get news  localhost:50051 carbon.CarbonService/GetFinanceData      "country": "Brazil",

    print("\n" + "="*70)

    print("NON-STREAMING: GetNonStreamingNews (Direct SQL)")      "vintage": 2024,

    print("="*70)

    # Get Tesla price      "supply": 50000.0

    news = stub.GetNonStreamingNews(pb2.NewsQuery())

    print(f"Found {len(news.items)} news articles from database")grpcurl -plaintext -d '{"ticker":"TSLA"}' \    },



    for n in news.items[:3]:  localhost:50051 carbon.CarbonService/GetFinanceData    {

        print(f"  • {n.title[:60]}... ({n.source})")

          "project_id": "VCS-5678",

    # Filter by source

    print("\n" + "="*70)# Get NextEra Energy price      "project_name": "Solar Farm Project",

    print("NON-STREAMING: Reuters News (Direct SQL)")

    print("="*70)grpcurl -plaintext -d '{"ticker":"NEE"}' \      "registry_status": "ACTIVE",



    reuters = stub.GetNonStreamingNews(pb2.NewsQuery(source="Reuters"))  localhost:50051 carbon.CarbonService/GetFinanceData      "country": "India",

    print(f"Found {len(reuters.items)} Reuters articles")

    ```      "vintage": 2023,

    # Get finance data

    print("\n" + "="*70)      "supply": 25000.0

    print("NON-STREAMING: GetNonStreamingFinanceData (Direct SQL)")

    print("="*70)**Example Response:**    }



    finance = stub.GetNonStreamingFinanceData(pb2.FinanceQuery())```json  ]

    print(f"Found {finance.count} finance records from database")

    {}

    if finance.items:

        for f in finance.items[:3]:  "items": [```

            print(f"  • {f.ticker}: ${f.price:.2f} ({f.change_percent:+.2f}%)")

        {

    channel.close()

      "ticker": "KRBN",**Response Fields Explained:**

if __name__ == "__main__":

    main()      "price": 42.50,

```

      "timestamp": 1733328000| Field             | Type   | Description                                              | Example              |

---

    },| ----------------- | ------ | -------------------------------------------------------- | -------------------- |

## 🎯 Performance Characteristics

    {| `project_id`      | string | Unique identifier from Verra registry                    | "VCS-1234"           |

**Response Times (Average):**

- Cached response: **8-12ms**      "ticker": "TSLA",| `project_name`    | string | Official project name                                    | "Solar Farm Project" |

- Uncached streaming: **80-150ms**

- Uncached non-streaming: **50-100ms**      "price": 248.75,| `registry_status` | string | Current status (ACTIVE, RETIRED, UNDER_VALIDATION)       | "ACTIVE"             |

- First request after startup: **200-500ms** (cache warm-up)

      "timestamp": 1733328000| `country`         | string | Project location/country                                 | "Brazil"             |

**Throughput:**

- Concurrent requests: **1,000+ req/sec** (cached)    },| `vintage`         | int32  | Year the carbon credits were generated                   | 2024                 |

- Uncached requests: **100-200 req/sec**

    {| `supply`          | double | Number of available carbon credits (in metric tons CO2e) | 50000.0              |

**Data Freshness:**

- Database updates: Every **60 seconds** (scrapers)      "ticker": "NEE",

- CDC latency: **2-5 seconds** (Postgres → Kafka → Pathway)

- Cache TTL: **5 minutes**      "price": 67.90,**Filters:**

- Effective latency: **5-10 seconds** for new data to appear in streaming API

- Non-streaming: **Instant** (current database state)      "timestamp": 1733328000



---    }- No filter: Returns all projects (up to system limit)



## 🏭 Technology Stack  ]- `country="Brazil"`: Returns only projects from Brazil



- **PostgreSQL 15** - Primary database with logical replication (WAL)}- Country names are case-sensitive

- **Debezium 2.3** - Change Data Capture connector

- **Apache Kafka 7.5.0** - Event streaming platform````

- **Pathway 0.7.0** - Real-time stream processing

- **gRPC** - High-performance API (Protocol Buffers)**Cache Behavior:**

- **Redis 7** - Response caching (5-minute TTL)

- **Docker** - Containerization and orchestration**Performance:**

- **Python 3.10** - Application runtime

- **psycopg2** - PostgreSQL database adapter- Cached: ~10ms response time- Cache Key: `projects:ALL` (no filter) or `projects:{country}` (with filter)



---- Uncached: ~100ms response time- TTL: 5 minutes



## 📂 Project Structure- Cache TTL: 5 minutes- Cache hit reduces response time from ~100ms to <10ms



```- Data freshness: Updated every 60 seconds (market hours)

carbon-intelligence/

├── db/---

│   ├── init.sql              # Database schema initialization

│   └── postgres.conf         # PostgreSQL configuration (WAL)---

├── debezium/

│   └── connector.json        # Debezium CDC connector config### 2. GetNews - Query Carbon-Related News

├── scrapers/

│   ├── main.py               # Scraper orchestrator## Data Flow

│   ├── verra_scraper.py      # Verra registry scraper

│   ├── carbonmark_scraper.py # Carbonmark subgraph scraper**Endpoint:** `carbon.CarbonService/GetNews`

│   ├── finance_scraper.py    # Yahoo Finance scraper

│   ├── news_scraper.py       # News RSS aggregator### Step-by-Step Process

│   ├── requirements.txt      # Python dependencies

│   └── Dockerfile            # Scraper container**Request Message:**

├── server/

│   ├── proto/**1. Data Collection (Every 60 seconds)**

│   │   └── carbon_service.proto  # gRPC service definition

│   ├── grpc_server.py        # gRPC server implementation````protobuf

│   ├── pipeline.py           # Pathway stream processing

│   ├── redis_cache.py        # Redis caching layerThe scrapers run continuously in the `carbon_scrapers` container:message NewsQuery {

│   ├── schemas.py            # Data schemas for Pathway

│   ├── carbon_service_pb2.py # Generated protobuf code  string source = 1;  // Optional: Filter by news source

│   ├── carbon_service_pb2_grpc.py # Generated gRPC stubs

│   ├── full_system_test_docker.py # Test suite```python}

│   ├── requirements.txt      # Python dependencies

│   └── Dockerfile            # Server container# scrapers/main.py```

├── docker-compose.yml        # Service orchestration

├── start.sh                  # Automated setup scriptwhile True:

├── test_docker.sh            # Test execution script

├── regen_grpc.sh             # Regenerate gRPC code    scrape_verra()        # Fetch Verra projects**Response Message:**

├── example.py                # API usage examples

└── README.md                 # This file    scrape_carbonmark()   # Fetch Carbonmark data

```

    scrape_finance()      # Fetch stock prices```protobuf

---

    scrape_news()         # Fetch news articlesmessage NewsResponse {

## 🤝 Contributing

    time.sleep(60)        # Wait 60 seconds  repeated NewsItem items = 1;

Contributions are welcome! Please feel free to submit a Pull Request.

```}

---



## 📄 License

Each scraper inserts data directly into PostgreSQL:message NewsItem {

This project is licensed under the MIT License.

```sql  string guid = 1;      // Unique news identifier

---

INSERT INTO verra (project_id, project_name, country, vintage, supply)  string title = 2;     // Article headline

## 📧 Support

VALUES ('VCS-1234', 'Solar Project', 'Brazil', 2024, 50000)  string link = 3;      // URL to full article

For questions or issues, please open an issue on GitHub or contact the maintainers.

ON CONFLICT (project_id) DO UPDATE SET supply = EXCLUDED.supply;  string published = 4; // Publication timestamp

---

```  string source = 5;    // News source/publisher

**Built with ❤️ for a sustainable future 🌱**

  string summary = 6;   // Article excerpt or summary

**2. Change Data Capture**}

````

PostgreSQL is configured with logical replication:

````conf**Example Request (Python):**

# db/postgres.conf

wal_level = logical```python

```# Get all news

response = stub.GetNews(pb2.NewsQuery())

Every INSERT/UPDATE/DELETE generates a Write-Ahead Log (WAL) event.

# Filter by source

Debezium monitors the replication slot and converts WAL events to JSON:response = stub.GetNews(pb2.NewsQuery(source="Reuters"))

```json```

{

  "before": null,**Example Response Data:**

  "after": {

    "id": 1,```json

    "project_id": "VCS-1234",{

    "project_name": "Solar Project",  "items": [

    "country": "Brazil",    {

    "vintage": 2024,      "guid": "abc123def456",

    "supply": 50000.0      "title": "New carbon credit framework adopted at COP30",

  },      "link": "https://example.com/news/cop30-framework",

  "op": "c",  // c=create, u=update, d=delete      "published": "Thu, 30 Nov 2025 14:30:00 GMT",

  "ts_ms": 1733328000000      "source": "Reuters",

}      "summary": "Global leaders agree on new standardized carbon credit framework..."

```    },

    {

**3. Kafka Streaming**      "guid": "xyz789ghi012",

      "title": "Carbon offset market reaches $2B in Q4",

Debezium publishes CDC events to Kafka topics:      "link": "https://example.com/news/market-growth",

- `carbon.public.verra` - Verra project changes      "published": "Wed, 29 Nov 2025 09:15:00 GMT",

- `carbon.public.carbonmark` - Carbonmark changes      "source": "Bloomberg",

- `carbon.public.finance` - Stock price updates      "summary": "The voluntary carbon market has seen unprecedented growth..."

- `carbon.public.news` - News article additions    }

  ]

**4. Stream Processing**}

````

Pathway consumes from all Kafka topics and processes the data:

**Response Fields Explained:**

````python

# server/pipeline.py| Field       | Type   | Description                                          | Example                                |

| ----------- | ------ | ---------------------------------------------------- | -------------------------------------- |

# Read from Kafka CDC topics| `guid`      | string | Unique identifier (hash of article)                  | "4a48dad0640e23b4531504"               |

verra = pw.io.debezium.read(| `title`     | string | Article headline/title                               | "Carbon market reaches $2B"            |

    rdkafka_settings,| `link`      | string | Full URL to the news article                         | "https://reuters.com/article/123"      |

    topic_name="carbon.public.verra",| `published` | string | Publication date/time in RFC 822 format              | "Thu, 30 Nov 2025 14:30:00 GMT"        |

    schema=VerraSchema| `source`    | string | Publisher/news source                                | "Reuters", "Bloomberg", "The Guardian" |

)| `summary`   | string | Article excerpt, first paragraph, or RSS description | "Global leaders agree on new..."       |



carbonmark = pw.io.debezium.read(**Filters:**

    rdkafka_settings,

    topic_name="carbon.public.carbonmark",- No filter: Returns latest 100 news items

    schema=CarbonmarkSchema- `source="Reuters"`: Returns only articles from Reuters

)- Source names are case-sensitive



# Join verra and carbonmark on project_id**News Sources Tracked:**

projects = carbonmark.join(

    verra,- Reuters

    carbonmark.project_id == verra.project_id- Bloomberg

).select(- The Guardian

    project_id=verra.project_id,- BBC

    project_name=carbonmark.project_name,- Financial Times

    country=verra.country,- CNBC

    vintage=verra.vintage,- Associated Press

    supply=verra.supply,- And more...

    registry_status=verra.registry_status

)**Cache Behavior:**



# Write to output file- Cache Key: `news:ALL` (no filter) or `news:{source}` (with filter)

pw.io.jsonlines.write(projects, "./output/projects.jsonl")- TTL: 5 minutes

```- Returns maximum 100 most recent articles



This creates materialized views in JSON Lines format:---

```jsonl

{"project_id":"VCS-1234","project_name":"Solar Project","country":"Brazil","vintage":2024,"supply":50000.0,"registry_status":"ACTIVE","diff":1,"time":1733328000526}### 3. GetFinanceData - Query Carbon-Related Stock Data

{"project_id":"VCS-5678","project_name":"Wind Farm","country":"India","vintage":2023,"supply":25000.0,"registry_status":"ACTIVE","diff":1,"time":1733328001234}

```**Endpoint:** `carbon.CarbonService/GetFinanceData`



The `diff` field indicates: `1` = new/updated, `-1` = deleted**Request Message:**



**5. API Serving**```protobuf

message FinanceQuery {

The gRPC server reads these JSONL files and serves requests:  string ticker = 1;  // Optional: Filter by stock ticker symbol

}

```python```

# server/grpc_server.py

**Response Message:**

def GetProjects(self, request, context):

    # Check Redis cache first```protobuf

    cache_key = f"projects:{request.country or 'ALL'}"message FinanceResponse {

    cached = redis_get(cache_key)  repeated FinanceItem items = 1;

    if cached:}

        return cached  # Return in ~10ms

    message FinanceItem {

    # Read from Pathway output  string ticker = 1;   // Stock ticker symbol

    projects = []  double price = 2;    // Current stock price

    with open('/app/output/projects.jsonl', 'r') as f:  int64 timestamp = 3; // Unix timestamp of last update

        for line in f:}

            project = json.loads(line)```

            if project['diff'] == 1:  # Active record

                if not request.country or project['country'] == request.country:**Example Request (Python):**

                    projects.append(project)

    ```python

    # Build response# Get all finance data

    response = ProjectResponse()response = stub.GetFinanceData(pb2.FinanceQuery())

    for p in projects:

        item = ProjectItem(# Filter by ticker

            project_id=p['project_id'],response = stub.GetFinanceData(pb2.FinanceQuery(ticker="KRBN"))

            project_name=p['project_name'],```

            country=p['country'],

            vintage=p['vintage'],**Example Response Data:**

            supply=p['supply'],

            registry_status=p['registry_status']```json

        ){

        response.items.append(item)  "items": [

        {

    # Cache for 5 minutes      "ticker": "KRBN",

    redis_set(cache_key, response, ttl=300)      "price": 42.5,

          "timestamp": 1733328000

    return response  # Return in ~100ms    },

```    {

      "ticker": "TSLA",

**6. Caching**      "price": 248.75,

      "timestamp": 1733328000

Redis stores serialized responses with a 5-minute TTL:    },

```    {

Key: "projects:Brazil"      "ticker": "NEE",

Value: <serialized ProjectResponse>      "price": 67.9,

TTL: 300 seconds      "timestamp": 1733328000

```    }

  ]

Subsequent requests for the same query hit the cache and return in ~10ms.}

````

### Performance Timeline

**Response Fields Explained:**

````

T+0.0s  : Scraper inserts new project into PostgreSQL| Field       | Type   | Description                          | Example    |

T+0.1s  : PostgreSQL commits transaction, creates WAL event| ----------- | ------ | ------------------------------------ | ---------- |

T+0.6s  : Debezium captures WAL event and publishes to Kafka| `ticker`    | string | Stock ticker symbol                  | "KRBN"     |

T+0.8s  : Pathway consumer receives Kafka message| `price`     | double | Current stock price in USD           | 42.50      |

T+2.8s  : Pathway updates projects.jsonl file| `timestamp` | int64  | Unix timestamp (seconds since epoch) | 1733328000 |

T+2.9s  : New data available in gRPC API (if cache expired)

```**Tracked Tickers (47 companies):**



**End-to-end latency: 2-5 seconds****Carbon ETFs:**



---- KRBN - KraneShares Global Carbon Strategy ETF

- KCCA - KraneShares California Carbon Allowance ETF

## Monitoring

**Clean Energy:**

### Check Service Status

- TSLA - Tesla Inc

```bash- NEE - NextEra Energy

# View all containers- ENPH - Enphase Energy

docker-compose ps- FSLR - First Solar



# Should show:**Utilities & Infrastructure:**

# NAME              STATUS

# carbon_pathway    Up XX minutes (healthy)- BEP - Brookfield Renewable Partners

# carbon_scrapers   Up XX minutes- AQN - Algonquin Power & Utilities

# carbon_postgres   Up XX minutes (healthy)

# redis             Up XX minutes (healthy)**Industrial & Materials:**

# kafka             Up XX minutes (healthy)

# debezium          Up XX minutes (healthy)- LIN - Linde plc (Carbon capture)

# zookeeper         Up XX minutes (healthy)- APD - Air Products (Hydrogen)

````

**And 37 more carbon-related companies...**

### View Logs

**Filters:**

```bash

# All services- No filter: Returns all 47 tracked stocks

docker-compose logs -f- `ticker="KRBN"`: Returns only KRBN ETF data



# Specific service**Cache Behavior:**

docker logs carbon_scrapers -f

docker logs carbon_pathway -f- Cache Key: `finance:ALL` or `finance:{ticker}`

docker logs debezium -f- TTL: 5 minutes

- Data updated every 60 seconds by scrapers

# Last 100 lines

docker logs carbon_scrapers --tail 100---

```

### Complete Integration Example

### Monitor Data Flow

**Python Client:**

**Check Database:**

`bash`python

# Connect to PostgreSQL#!/usr/bin/env python3

docker exec -it carbon_postgres psql -U carbon -d carbon_intel"""Complete example of using the Carbon Intelligence API"""

# Count recordsimport grpc

SELECT COUNT(\*) FROM verra;import carbon_service_pb2 as pb2

SELECT COUNT(\*) FROM carbonmark;import carbon_service_pb2_grpc as pb2_grpc

SELECT COUNT(\*) FROM finance;

SELECT COUNT(\*) FROM news;def main():

    # Connect to server

# View recent data channel = grpc.insecure_channel('localhost:50051')

SELECT \* FROM news ORDER BY published DESC LIMIT 5; stub = pb2_grpc.CarbonServiceStub(channel)

````

    # 1. Get all carbon projects

**Check Kafka Topics:**    print("=" * 50)

```bash    print("ALL CARBON PROJECTS")

# List all topics    print("=" * 50)

docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list    projects = stub.GetProjects(pb2.ProjectQuery())

    for p in projects.items[:5]:  # Show first 5

# Should show:        print(f"ID: {p.project_id}")

# carbon.public.verra        print(f"Name: {p.project_name}")

# carbon.public.carbonmark        print(f"Country: {p.country}")

# carbon.public.finance        print(f"Supply: {p.supply:,.0f} credits")

# carbon.public.news        print("-" * 50)



# Consume recent messages    # 2. Get projects from specific country

docker exec kafka kafka-console-consumer \    print("\nPROJECTS IN BRAZIL")

  --bootstrap-server localhost:9092 \    print("=" * 50)

  --topic carbon.public.news \    brazil_projects = stub.GetProjects(pb2.ProjectQuery(country="Brazil"))

  --max-messages 5 \    print(f"Found {len(brazil_projects.items)} projects in Brazil")

  --from-beginning

```    # 3. Get latest carbon news

    print("\nLATEST CARBON NEWS")

**Check Pathway Output:**    print("=" * 50)

```bash    news = stub.GetNews(pb2.NewsQuery())

# View output files    for n in news.items[:3]:  # Show first 3

docker exec carbon_pathway ls -lh /app/output/        print(f"Title: {n.title}")

        print(f"Source: {n.source}")

# Watch live updates        print(f"Published: {n.published}")

docker exec carbon_pathway tail -f /app/output/projects.jsonl        print(f"Link: {n.link}")

docker exec carbon_pathway tail -f /app/output/news.jsonl        print("-" * 50)



# Count records    # 4. Get news from specific source

docker exec carbon_pathway wc -l /app/output/projects.jsonl    print("\nNEWS FROM REUTERS")

docker exec carbon_pathway wc -l /app/output/news.jsonl    print("=" * 50)

```    reuters_news = stub.GetNews(pb2.NewsQuery(source="Reuters"))

    print(f"Found {len(reuters_news.items)} articles from Reuters")

**Check Redis Cache:**

```bash    # 5. Get carbon finance data

# Connect to Redis    print("\nCARBON FINANCE DATA")

docker exec -it redis redis-cli    print("=" * 50)

    finance = stub.GetFinanceData(pb2.FinanceQuery())

# List all cache keys    for f in finance.items[:5]:  # Show first 5

KEYS *        print(f"{f.ticker}: ${f.price:.2f}")



# View cached data    # 6. Get specific ticker

GET "projects:ALL"    krbn = stub.GetFinanceData(pb2.FinanceQuery(ticker="KRBN"))

GET "news:Reuters"    if krbn.items:

        print(f"\nKRBN ETF Price: ${krbn.items[0].price:.2f}")

# Check TTL

TTL "projects:ALL"    channel.close()



# Clear cache (for testing)if __name__ == "__main__":

FLUSHALL    main()

````

**Check Debezium Connector:\*\***JavaScript/Node.js Client:\*\*

````bash

# List connectors```javascript

curl http://localhost:8083/connectorsconst grpc = require("@grpc/grpc-js");

const protoLoader = require("@grpc/proto-loader");

# Check connector status

curl http://localhost:8083/connectors/postgres-connector/status | jq// Load proto file

const packageDefinition = protoLoader.loadSync("carbon_service.proto");

# Should show:const carbon = grpc.loadPackageDefinition(packageDefinition).carbon;

# {

#   "name": "postgres-connector",// Create client

#   "connector": {const client = new carbon.CarbonService(

#     "state": "RUNNING"  "localhost:50051",

#   },  grpc.credentials.createInsecure()

#   "tasks": [);

#     {

#       "id": 0,// Get all projects

#       "state": "RUNNING"client.getProjects({}, (error, response) => {

#     }  if (error) {

#   ]    console.error("Error:", error);

# }    return;

```  }

  console.log(`Found ${response.items.length} projects`);

### Performance Metrics  response.items.forEach((project) => {

    console.log(`${project.project_name} (${project.country})`);

**API Response Times:**  });

```bash});

# Install grpcurl if needed

# macOS: brew install grpcurl// Get news from specific source

# Linux: go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latestclient.getNews({ source: "Reuters" }, (error, response) => {

  if (error) {

# Measure response time    console.error("Error:", error);

time grpcurl -plaintext localhost:50051 carbon.CarbonService/GetProjects    return;

  }

# Expected:  console.log(`Found ${response.items.length} Reuters articles`);

# Cached: ~0.01s (10ms)});

# Uncached: ~0.10s (100ms)```

````

**cURL (using grpcurl):**

**System Resources:**

`bash`bash

# Docker stats# List available services

docker statsgrpcurl -plaintext localhost:50051 list

# Expected CPU: 10-30% total# Get all projects

# Expected RAM: 6-8 GB totalgrpcurl -plaintext localhost:50051 carbon.CarbonService/GetProjects

````

# Get projects from Brazil

---grpcurl -plaintext -d '{"country":"Brazil"}' \

  localhost:50051 carbon.CarbonService/GetProjects

## Troubleshooting

# Get all news

### Issue: Services won't startgrpcurl -plaintext localhost:50051 carbon.CarbonService/GetNews



**Check Docker:**# Get Reuters news

```bashgrpcurl -plaintext -d '{"source":"Reuters"}' \

# Ensure Docker is running  localhost:50051 carbon.CarbonService/GetNews

docker info

# Get all finance data

# Check available resourcesgrpcurl -plaintext localhost:50051 carbon.CarbonService/GetFinanceData

docker system df

# Get specific ticker

# If needed, clean upgrpcurl -plaintext -d '{"ticker":"KRBN"}' \

docker system prune -a  localhost:50051 carbon.CarbonService/GetFinanceData

````

**Solution:**### Error Handling

```bash

# Stop everything**Common gRPC Status Codes:**

docker-compose down -v

| Code | Status            | Description    | Example                          |

# Rebuild and restart| ---- | ----------------- | -------------- | -------------------------------- |

docker-compose up -d --build| 0    | OK                | Success        | Request completed successfully   |

| 2    | UNKNOWN           | Internal error | File read failure, parsing error |

# Wait for health checks| 4    | DEADLINE_EXCEEDED | Timeout        | Request took too long            |

watch docker-compose ps| 14   | UNAVAILABLE       | Service down   | Server not running               |

```

**Python Error Handling:**

### Issue: Debezium connector not working

```````python

**Check status:**import grpc

```bash

curl http://localhost:8083/connectors/postgres-connector/statustry:

```    response = stub.GetProjects(pb2.ProjectQuery(), timeout=10)

    # Process response...

**If connector doesn't exist:**except grpc.RpcError as e:

```bash    print(f"gRPC Error: {e.code()}")

# Wait 30 seconds after startup, then:    print(f"Details: {e.details()}")

curl -X POST http://localhost:8083/connectors \

  -H "Content-Type: application/json" \    if e.code() == grpc.StatusCode.UNAVAILABLE:

  -d @debezium/connector.json        print("Server is not available")

```    elif e.code() == grpc.StatusCode.DEADLINE_EXCEEDED:

        print("Request timeout")

**If connector is FAILED:**```

```bash

# Check logs### Performance Benchmarks

docker logs debezium -f

**Response Times (Average):**

# Delete and recreate

curl -X DELETE http://localhost:8083/connectors/postgres-connector- Cached response: **8-12ms**

curl -X POST http://localhost:8083/connectors \- Uncached response: **80-150ms**

  -H "Content-Type: application/json" \- First request after startup: **200-500ms** (cache warm-up)

  -d @debezium/connector.json

```**Throughput:**



### Issue: No data in Kafka topics- Concurrent requests: **1,000+ req/sec** (cached)

- Uncached requests: **100-200 req/sec**

**Check replication slot:**

```bash**Data Freshness:**

docker exec carbon_postgres psql -U carbon -d carbon_intel \

  -c "SELECT * FROM pg_replication_slots;"- Database updates: Every **60 seconds** (scrapers)

- CDC latency: **2-5 seconds** (Postgres → Kafka → Pathway)

# Should show 'debezium' slot with active=true- Cache TTL: **5 minutes**

```- Effective latency: **5-10 seconds** for new data to appear in API



**Check WAL settings:**## 🔧 Configuration

```bash

docker exec carbon_postgres psql -U carbon -d carbon_intel \### Environment Setup

  -c "SHOW wal_level;"

Copy the environment template:

# Should show 'logical'

``````bash

cp .env.example .env

### Issue: API returns no data```



**Check Pathway output:**Edit `.env` to customize:

```bash

# Check if files exist and have data- Database credentials

docker exec carbon_pathway ls -lh /app/output/- Service ports

docker exec carbon_pathway head /app/output/projects.jsonl- API keys (if needed)



# If empty, check Pathway logs### Scraper Frequency

docker logs carbon_pathway -f

```Edit `scrapers/main.py`:



**Restart Pathway:**```python

```bash# Change from 60 seconds to desired interval

docker-compose restart carbon_pathwaytime.sleep(60)  # ← Modify this value

````````

### Issue: Scrapers not collecting data### Cache TTL

**Check scraper logs:**Edit `server/redis_cache.py`:

```````bash

docker logs carbon_scrapers -f```python

```def cache_set(key, value):

    r.set(key, json.dumps(value), ex=300)  # ← Change 300 (5 minutes)

**Check database:**```

```bash

docker exec carbon_postgres psql -U carbon -d carbon_intel \### Adding Tickers

  -c "SELECT COUNT(*) FROM news;"

Edit `scrapers/main.py`:

# If 0, scrapers may be failing

``````python

COMPANIES = [

**Restart scrapers:**    "KRBN",

```bash    "TSLA",

docker-compose restart carbon_scrapers    "YOUR_TICKER",  # Add here

```]

```````

### Issue: High latency

## 📊 Data Models

**Check cache:**

````bash### Verra Schema

docker exec redis redis-cli

> KEYS *```python

> TTL "projects:ALL"{

  "id": str,              # Unique identifier

# If cache is empty, responses will be slower  "project_id": str,      # Verra project ID

```  "registry_status": str, # ACTIVE, RETIRED, etc.

  "country": str,         # Project country

**Check Pathway processing:**  "vintage": int,         # Credit vintage year

```bash  "supply": float         # Available credits

# Pathway should complete updates within 2-3 seconds}

docker logs carbon_pathway --tail 50```

````

### Carbonmark Schema

### Issue: Out of memory

````python

**Check Docker limits:**{

```bash  "id": str,          # Unique identifier

docker stats  "project_id": str,  # Project ID

  "project_name": str,# Project name

# If containers are using >90% memory:  "vintage": int,     # Credit vintage year

# 1. Increase Docker memory limit in Docker Desktop  "amount": float     # Token supply

# 2. Or reduce scraper frequency in scrapers/main.py}

````

---### Finance Schema

## Complete Usage Example```python

{

Here's a complete example showing how to use all three endpoints: "ticker": str, # Stock ticker symbol

"price": float, # Current stock price

````python "timestamp": int  # Unix timestamp

#!/usr/bin/env python3}

"""```

Complete Carbon Intelligence API Example

Demonstrates all endpoints and features### News Schema

"""

```python

import grpc{

import carbon_service_pb2 as pb2  "guid": str,      # Unique news identifier

import carbon_service_pb2_grpc as pb2_grpc  "title": str,     # Article headline

from datetime import datetime  "link": str,      # Article URL

  "published": str, # Publication date

def main():  "source": str,    # News source

    # Connect to gRPC server  "summary": str    # Article summary

    print("Connecting to Carbon Intelligence API...")}

    channel = grpc.insecure_channel('localhost:50051')```

    stub = pb2_grpc.CarbonServiceStub(channel)

    print("✓ Connected!\n")## 🛠️ Technology Stack



    # ==========================================### Core Components

    # EXAMPLE 1: Get All Carbon Projects

    # ==========================================- **PostgreSQL 15** - Primary data store with logical replication

    print("=" * 70)- **Debezium 2.3** - Change data capture connector

    print("CARBON OFFSET PROJECTS")- **Apache Kafka 7.5.0** - Event streaming platform

    print("=" * 70)- **Pathway 0.7.0** - Real-time stream processing framework

    - **gRPC** - High-performance RPC framework

    projects_response = stub.GetProjects(pb2.ProjectQuery())- **Redis 7** - In-memory caching layer

    print(f"Found {len(projects_response.items)} projects\n")- **Docker** - Containerization and orchestration



    for i, project in enumerate(projects_response.items[:3], 1):### Python Libraries

        print(f"Project #{i}")

        print(f"  ID: {project.project_id}")**Scrapers:**

        print(f"  Name: {project.project_name}")

        print(f"  Country: {project.country}")- `requests` - HTTP client

        print(f"  Status: {project.registry_status}")- `beautifulsoup4` - HTML parsing

        print(f"  Vintage: {project.vintage}")- `psycopg2` - PostgreSQL adapter

        print(f"  Supply: {project.supply:,.0f} metric tons CO2e")- `yfinance` - Yahoo Finance data

        print()- `feedparser` - RSS feed parsing



    # ==========================================**Server:**

    # EXAMPLE 2: Filter Projects by Country

    # ==========================================- `grpcio` - gRPC runtime

    print("=" * 70)- `pathway` - Stream processing

    print("PROJECTS IN BRAZIL")- `redis` - Redis client

    print("=" * 70)- `protobuf` - Protocol buffers



    brazil_response = stub.GetProjects(pb2.ProjectQuery(country="Brazil"))## 📁 Project Structure

    print(f"Found {len(brazil_response.items)} Brazilian projects\n")

    ```

    for project in brazil_response.items:carbon-intelligence/

        print(f"  • {project.project_name} ({project.supply:,.0f} credits)")├── db/

    print()│   ├── init.sql              # PostgreSQL schema initialization

    │   └── postgres.conf         # PostgreSQL configuration (WAL enabled)

    # ==========================================│

    # EXAMPLE 3: Get Carbon News├── debezium/

    # ==========================================│   └── connector.json        # Debezium CDC connector configuration

    print("=" * 70)│

    print("LATEST CARBON NEWS")├── scrapers/

    print("=" * 70)│   ├── Dockerfile            # Scrapers container image

    │   ├── main.py               # Orchestrates all scrapers

    news_response = stub.GetNews(pb2.NewsQuery())│   ├── verra_scraper.py      # Verra registry scraper

    print(f"Found {len(news_response.items)} articles\n")│   ├── carbonmark_scraper.py # Carbonmark blockchain scraper

    │   ├── finance_scraper.py    # Yahoo Finance scraper

    for i, article in enumerate(news_response.items[:5], 1):│   ├── news_scraper.py       # RSS news aggregator

        print(f"Article #{i}")│   └── requirements.txt      # Python dependencies

        print(f"  Title: {article.title}")│

        print(f"  Source: {article.source}")├── server/

        print(f"  Published: {article.published}")│   ├── proto/

        print(f"  Link: {article.link}")│   │   └── carbon_service.proto    # gRPC API definition

        print(f"  Summary: {article.summary[:100]}...")│   ├── Dockerfile                  # Server container image

        print()│   ├── grpc_server.py              # gRPC API implementation

    │   ├── pipeline.py                 # Pathway stream processing

    # ==========================================│   ├── schemas.py                  # Pathway data schemas

    # EXAMPLE 4: Filter News by Source│   ├── redis_cache.py              # Redis caching utilities

    # ==========================================│   ├── carbon_service_pb2.py       # Generated protobuf code

    print("=" * 70)│   ├── carbon_service_pb2_grpc.py  # Generated gRPC code

    print("REUTERS ARTICLES")│   ├── full_system_test_docker.py  # Comprehensive test suite

    print("=" * 70)│   └── requirements.txt            # Python dependencies

    │

    reuters_response = stub.GetNews(pb2.NewsQuery(source="Reuters"))├── docker-compose.yml        # Multi-container orchestration

    print(f"Found {len(reuters_response.items)} Reuters articles\n")├── start.sh                  # Automated startup script

    ├── test_docker.sh            # Automated test script

    for article in reuters_response.items[:3]:├── example.py                # API usage examples

        print(f"  • {article.title}")└── README.md                 # This file

    print()```



    # ==========================================## 🔍 Monitoring and Observability

    # EXAMPLE 5: Get Carbon Finance Data

    # ==========================================### View Logs

    print("=" * 70)

    print("CARBON-RELATED STOCKS")**All services:**

    print("=" * 70)

    ```bash

    finance_response = stub.GetFinanceData(pb2.FinanceQuery())docker-compose logs -f

    print(f"Found {len(finance_response.items)} stocks\n")```



    for i, stock in enumerate(finance_response.items[:10], 1):**Specific service:**

        timestamp = datetime.fromtimestamp(stock.timestamp)

        print(f"{i:2}. {stock.ticker:6} | ${stock.price:8.2f} | Updated: {timestamp}")```bash

    print()docker logs carbon_scrapers -f

    docker logs carbon_pathway -f

    # ==========================================docker logs postgres -f

    # EXAMPLE 6: Get Specific Stockdocker logs kafka -f

    # ==========================================docker logs debezium -f

    print("=" * 70)```

    print("KRBN CARBON ETF DETAILS")

    print("=" * 70)### Check Pathway Streaming



    krbn_response = stub.GetFinanceData(pb2.FinanceQuery(ticker="KRBN"))**Watch live updates:**

    if krbn_response.items:

        krbn = krbn_response.items[0]```bash

        timestamp = datetime.fromtimestamp(krbn.timestamp)docker exec carbon_pathway tail -f /app/output/projects.jsonl

        print(f"  Ticker: {krbn.ticker}")docker exec carbon_pathway tail -f /app/output/news.jsonl

        print(f"  Price: ${krbn.price:.2f}")```

        print(f"  Last Update: {timestamp}")

    else:**Check file sizes:**

        print("  KRBN data not available")

    print()```bash

    docker exec carbon_pathway ls -lh /app/output/

    # ==========================================```

    # EXAMPLE 7: Summary Statistics

    # ==========================================### Monitor Kafka Topics

    print("=" * 70)

    print("SUMMARY STATISTICS")**List topics:**

    print("=" * 70)

    ```bash

    # Count projects by countrydocker exec kafka kafka-topics --bootstrap-server localhost:9092 --list

    countries = {}```

    for project in projects_response.items:

        countries[project.country] = countries.get(project.country, 0) + 1**Consume topic messages:**



    print(f"\nProjects by Country:")```bash

    for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:5]:docker exec kafka kafka-console-consumer \

        print(f"  {country:20} : {count} projects")  --bootstrap-server localhost:9092 \

      --topic carbon.public.verra \

    # Count news by source  --from-beginning \

    sources = {}  --max-messages 5

    for article in news_response.items:```

        sources[article.source] = sources.get(article.source, 0) + 1

    ### Check Database

    print(f"\nNews by Source:")

    for source, count in sorted(sources.items(), key=lambda x: x[1], reverse=True)[:5]:**PostgreSQL query:**

        print(f"  {source:20} : {count} articles")

    ```bash

    print("\n" + "=" * 70)docker exec postgres psql -U carbon -d carbon_intel \

    print("✓ Example completed successfully!")  -c "SELECT COUNT(*) FROM verra;"

    print("=" * 70)```



    channel.close()**Redis cache inspection:**



if __name__ == "__main__":```bash

    try:docker exec redis redis-cli KEYS "*"

        main()docker exec redis redis-cli GET "projects:ALL"

    except grpc.RpcError as e:```

        print(f"gRPC Error: {e.code()}")

        print(f"Details: {e.details()}")### System Health Check

        print("\nMake sure the services are running:")

        print("  docker-compose ps")```bash

    except Exception as e:# Check all containers running

        print(f"Error: {e}")docker ps

````

# Check Debezium connector

Save this as `client.py` and run:curl http://localhost:8083/connectors/carbon-connector/status

````bash

python client.py# Check API responsiveness

```grpcurl -plaintext localhost:50051 list

````

---

## 🚦 Performance Characteristics

## Project Structure

### Throughput

````

carbon-intelligence/- **Scrapers**: ~200 records/minute combined

├── README.md                 # This file- **Kafka**: 10,000+ messages/second capacity

├── docker-compose.yml        # Service orchestration- **Pathway**: Processes all CDC events in real-time

├── start.sh                  # Automated setup script- **gRPC API**: 1000+ requests/second uncached

├── test_docker.sh            # Test script- **Redis Cache**: 100,000+ reads/second

├── example.py                # API usage example

├── regen_grpc.sh             # Regenerate gRPC code### Latency

├── .env.example              # Environment template

├── .gitignore                # Git ignore rules- **End-to-end**: 2-5 seconds (data → API)

│- **API response** (cached): <10ms

├── db/- **API response** (uncached): <100ms

│   ├── init.sql              # PostgreSQL schema- **Cache TTL**: 5 minutes

│   └── postgres.conf         # PostgreSQL config (WAL enabled)

│### Resource Usage

├── debezium/

│   └── connector.json        # Debezium CDC configurationTypical Docker resource consumption:

│

├── scrapers/- **CPU**: 2-4 cores (1-2 during idle)

│   ├── Dockerfile            # Scrapers container- **RAM**: 6-8 GB total

│   ├── main.py               # Orchestration script  - PostgreSQL: 512 MB

│   ├── verra_scraper.py      # Verra registry scraper  - Kafka + Zookeeper: 2-3 GB

│   ├── carbonmark_scraper.py # Carbonmark scraper  - Pathway + gRPC: 1-2 GB

│   ├── finance_scraper.py    # Yahoo Finance scraper  - Scrapers: 500 MB

│   ├── news_scraper.py       # RSS news scraper  - Debezium: 1 GB

│   └── requirements.txt      # Python dependencies  - Redis: 100 MB

│- **Disk**: ~2 GB (grows with data)

└── server/- **Network**: 10-50 Mbps during scraping

    ├── Dockerfile            # Server container

    ├── grpc_server.py        # gRPC API implementation## 📚 Additional Resources

    ├── pipeline.py           # Pathway stream processing

    ├── schemas.py            # Pathway data schemas### Protocol Buffers

    ├── redis_cache.py        # Redis caching utilities

    ├── carbon_service_pb2.py       # Generated protobuf code- gRPC definition: `server/proto/carbon_service.proto`

    ├── carbon_service_pb2_grpc.py  # Generated gRPC code- Regenerate Python code:

    ├── full_system_test_docker.py  # Test suite  ```bash

    ├── requirements.txt      # Python dependencies  python -m grpc_tools.protoc \

    └── proto/    -I./server/proto \

        └── carbon_service.proto    # gRPC API definition    --python_out=./server \

```    --grpc_python_out=./server \

    ./server/proto/carbon_service.proto

---  ```



## Summary### Debezium Configuration



This Carbon Intelligence Platform provides:- Connector docs: https://debezium.io/documentation/reference/stable/connectors/postgresql.html

- Supported transforms: https://debezium.io/documentation/reference/stable/transformations/

✅ **Real-time data** - 2-5 second end-to-end latency from source to API

✅ **High performance** - <10ms cached responses, 1000+ req/sec throughput  ### Pathway Documentation

✅ **Multiple data sources** - Verra, Carbonmark, Yahoo Finance, RSS feeds

✅ **Simple deployment** - One command to start everything  - Official docs: https://pathway.com/developers/documentation

✅ **Production ready** - Health checks, caching, error handling  - Tutorial: https://pathway.com/developers/tutorials

✅ **Easy to use** - Three simple gRPC endpoints with filtering

## 🐛 Troubleshooting

**Get started in 2 minutes:**

```bash### Common Issues

./start.sh

python example.py**Issue: Debezium connector fails to start**

````

```bash

That's all you need! 🌱# Check PostgreSQL replication slot

docker exec postgres psql -U carbon -d carbon_intel -c "SELECT * FROM pg_replication_slots;"

# Should show 'debezium' slot
```

**Issue: Pathway not consuming events**

```bash
# Check Kafka topics exist
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Should show:
# carbon.public.verra
# carbon.public.carbonmark
# carbon.public.finance
# carbon.public.news
```

**Issue: API returns no data**

```bash
# Check Pathway output files
docker exec carbon_pathway ls -la /app/output/

# Check file contents
docker exec carbon_pathway head /app/output/projects.jsonl
```

**Issue: Services not starting**

```bash
# Check Docker resources
docker system df

# Restart all services
docker-compose down
docker-compose up -d --build
```

### Debugging Commands

**View service logs:**

```bash
# All services
docker-compose logs -f

# Specific service
docker logs carbon_scrapers -f
docker logs carbon_pathway -f
```

**Check connectivity:**

```bash
# PostgreSQL
docker exec postgres psql -U carbon -d carbon_intel -c "SELECT 1;"

# Redis
docker exec redis redis-cli PING

# Kafka
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

**Reset everything:**

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d --build
./start.sh  # Reconfigure
```
