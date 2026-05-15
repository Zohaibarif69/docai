#!/bin/bash

# Start both frontend and backend dev servers in parallel

echo "================================"
echo "Starting Smart Doctor Connect AI"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p logs

# Start backend
echo -e "${BLUE}[1/2] Starting Backend...${NC}"
cd backend
python -m uvicorn app.main:app --reload > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "   API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""

# Wait for backend to be ready
sleep 3

# Start frontend
echo -e "${BLUE}[2/2] Starting Frontend...${NC}"
cd ../frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   App: http://localhost:5173"
echo ""

echo "================================"
echo -e "${GREEN}Both servers are running!${NC}"
echo "================================"
echo ""
echo "📝 View logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep script running
wait
