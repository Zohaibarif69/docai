@echo off
REM Start both frontend and backend dev servers

echo ================================
echo Starting Smart Doctor Connect AI
echo ================================
echo.

REM Create logs directory
if not exist logs mkdir logs

REM Start backend in new window
echo [1/2] Starting Backend...
start "Smart Doctor Connect AI - Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload"
echo [OK] Backend started on http://localhost:8000
echo.

REM Wait for backend to be ready
timeout /t 3 /nobreak

REM Start frontend in new window
echo [2/2] Starting Frontend...
start "Smart Doctor Connect AI - Frontend" cmd /k "cd frontend && npm run dev"
echo [OK] Frontend started on http://localhost:5173
echo.

echo ================================
echo Both servers are running!
echo ================================
echo.
echo API Documentation: http://localhost:8000/docs
echo Application: http://localhost:5173
echo.
pause
