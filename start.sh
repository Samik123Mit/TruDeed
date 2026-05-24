#!/bin/bash

echo "═════════════════════════════════════════════════════════════"
echo "  TruDeed - Document Fraud Detection Platform"
echo "  Starting in 2 minutes..."
echo "═════════════════════════════════════════════════════════════"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker detected"
echo ""

# Start services
echo "🚀 Starting TruDeed services..."
echo ""

docker-compose up --build

echo ""
echo "═════════════════════════════════════════════════════════════"
echo "  TruDeed is now running!"
echo ""
echo "  🌐 Frontend: http://localhost:3000"
echo "  📡 API: http://localhost:8000"
echo ""
echo "  Next steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Click 'Launch App'"
echo "  3. Upload a document or use Demo Mode"
echo ""
echo "  To stop: Press Ctrl+C"
echo "═════════════════════════════════════════════════════════════"
