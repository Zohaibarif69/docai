@echo off
REM Setup script for entire Smart Doctor Connect AI project

echo ================================
echo Smart Doctor Connect AI - Full Setup
echo ================================
echo.

REM Setup Frontend
echo [1/2] Setting up Frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend setup failed
    exit /b 1
)
echo [OK] Frontend setup complete
echo.

REM Setup Backend
echo [2/2] Setting up Backend...
cd ..
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Backend setup failed
    exit /b 1
)

REM Setup environment file
if not exist .env (
    copy .env.example .env
    echo WARNING: Please update backend\.env with your configuration
)

echo [OK] Backend setup complete
echo.

echo ================================
echo [OK] Setup complete!
echo ================================
echo.
echo Next steps:
echo.
echo Option 1: Run individually
echo   Frontend: cd frontend ^&^& npm run dev
echo   Backend:  cd backend ^&^& venv\Scripts\activate.bat ^&^& python -m uvicorn app.main:app --reload
echo.
echo Option 2: Run both together
echo   scripts\start-dev.bat
echo.
echo Option 3: Run with Docker
echo   docker-compose up
echo.
pause
