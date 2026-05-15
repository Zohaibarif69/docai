#!/bin/bash

# Setup script for entire Smart Doctor Connect AI project

echo "================================"
echo "Smart Doctor Connect AI - Full Setup"
echo "================================"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi
echo "✅ Frontend setup complete"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd ../backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed"
    exit 1
fi

# Setup environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

echo "✅ Backend setup complete"
echo ""

echo "================================"
echo "✅ Setup complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "Option 1: Run individually"
echo "  Frontend: cd frontend && npm run dev"
echo "  Backend:  cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload"
echo ""
echo "Option 2: Run both together"
echo "  ./scripts/start-dev.sh"
echo ""
echo "Option 3: Run with Docker"
echo "  docker-compose up"
echo ""
