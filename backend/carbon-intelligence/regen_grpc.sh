#!/bin/bash
# filepath: /Users/dakshdesai/Codes/InterIIT Tech/carbon-intelligence/regenerate_grpc.sh

echo "Regenerating gRPC code inside Docker container..."

# Check if container is running
if ! docker ps | grep -q carbon_pathway; then
    echo "Error: carbon_pathway container is not running"
    echo "Please start the services first with: docker-compose up -d"
    exit 1
fi

# Generate gRPC code
docker exec carbon_pathway python -m grpc_tools.protoc \
  -I=/app/proto \
  --python_out=/app \
  --grpc_python_out=/app \
  /app/proto/carbon_service.proto

if [ $? -eq 0 ]; then
    echo "✅ gRPC code generated successfully!"
    echo "Restarting pathway container to load new code..."
    docker-compose restart carbon_pathway
    echo "✅ Done! Wait 5-10 seconds for the server to start."
else
    echo "❌ Error generating gRPC code"
    exit 1
fi