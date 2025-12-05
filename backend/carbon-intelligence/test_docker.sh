#!/bin/bash

set -e

echo "🧪 Carbon Intelligence Platform - Test Suite"
echo "============================================="
echo ""

if ! docker ps | grep -q carbon_pathway; then
    echo "❌ Error: carbon_pathway container is not running"
    echo "   Please start the system first: ./start.sh"
    exit 1
fi

echo "✅ carbon_pathway container is running"
echo ""

echo "📋 Copying test file to container..."
docker cp server/full_system_test_docker.py carbon_pathway:/app/test.py

echo "🚀 Running comprehensive test suite..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

docker exec carbon_pathway python /app/test.py

TEST_EXIT_CODE=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
    echo ""
    echo "System is fully operational 🎉"
else
    echo "❌ Some tests failed"
    echo ""
    echo "Check logs: docker logs carbon_pathway"
    exit 1
fi

echo ""
