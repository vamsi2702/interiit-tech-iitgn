#!/bin/bash

set -e

echo "🚀 Carbon Intelligence Platform - Startup Script"
echo "================================================="
echo ""

if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose not found. Please install docker-compose."
    exit 1
fi

echo "✅ docker-compose found"
echo ""

echo "🧹 Cleaning up existing containers..."
docker-compose down -v > /dev/null 2>&1

echo "🔨 Building containers (this may take a few minutes)..."
docker-compose build --quiet

echo "🚀 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to initialize (30 seconds)..."
sleep 30

echo ""
echo "� Configuring Debezium CDC connector..."
sleep 5

curl -s -X POST http://localhost:8083/connectors \
  -H 'Content-Type: application/json' \
  -d @debezium/connector.json > /dev/null 2>&1

if curl -s http://localhost:8083/connectors/carbon-connector/status | grep -q "RUNNING"; then
    echo "✅ Debezium connector configured successfully"
else
    echo "⚠️  Debezium connector may need manual setup"
    echo "   Run: curl -X POST http://localhost:8083/connectors -H 'Content-Type: application/json' -d @debezium/connector.json"
fi

echo ""
echo "✅ System startup complete!"
echo ""
echo "📍 Services:"
echo "   • PostgreSQL:  localhost:5432"
echo "   • Kafka:       localhost:9092"
echo "   • Debezium:    http://localhost:8083"
echo "   • Redis:       localhost:6379"
echo "   • gRPC API:    localhost:50051"
echo ""
echo "🧪 Run tests:    ./test_docker.sh"
echo "📝 View logs:    docker-compose logs -f [service]"
echo "🛑 Stop system:  docker-compose down"
echo ""
