#!/bin/bash

set -e

echo "🔧 Rebuilding T3 Platform..."
echo ""

# Function to retry command
retry_command() {
    local max_attempts=3
    local attempt=1
    local delay=5

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt of $max_attempts..."
        if "$@"; then
            return 0
        else
            if [ $attempt -lt $max_attempts ]; then
                echo "Failed. Retrying in ${delay}s..."
                sleep $delay
            fi
            attempt=$((attempt + 1))
        fi
    done

    echo "❌ Failed after $max_attempts attempts"
    return 1
}

# Pull images first to avoid build failures
echo "📥 Pulling Docker images..."
retry_command docker pull node:22
retry_command docker pull php:8.2-apache
retry_command docker pull mysql:latest
retry_command docker pull redis:latest

echo ""
echo "🏗️  Building t3_app..."
cd /home/user/t3/t3_app

# Try cached build first (faster)
if docker compose build; then
    echo "✅ t3_app built successfully"
else
    echo "⚠️  Cached build failed, trying without cache..."
    docker compose build --no-cache
fi

echo "🚀 Starting t3_app..."
docker compose up -d

echo ""
echo "🏗️  Building t3_system..."
cd /home/user/t3/t3_system

if docker compose build; then
    echo "✅ t3_system built successfully"
else
    echo "⚠️  Cached build failed, trying without cache..."
    docker compose build --no-cache
fi

echo "🚀 Starting t3_system..."
docker compose up -d

echo ""
echo "✅ All done! Checking status..."
echo ""
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🎉 T3 Platform is running!"
echo ""
echo "📍 Services:"
echo "   - t3_ui:      http://localhost:5177"
echo "   - t3_api:     http://localhost:8009"
echo "   - t3_system:  http://localhost:8000"
echo "   - PHPMyAdmin: http://localhost:9898"
