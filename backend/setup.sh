#!/bin/bash

# Smart Doctor Connect AI - Backend Setup Script
# This script sets up the FastAPI backend

echo "================================"
echo "Smart Doctor Connect AI Backend Setup"
echo "================================"
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.9+"
    exit 1
fi

echo "✅ Python found: $(python --version)"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Run: python -m uvicorn app.main:app --reload"
echo "3. Visit: http://localhost:8000/docs"
echo ""
