@echo off
REM Smart Doctor Connect AI - Backend Setup Script for Windows

echo ================================
echo Smart Doctor Connect AI Backend Setup
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.9+
    exit /b 1
)

echo ✅ Python found: 
python --version
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Copy environment file
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your configuration
)

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Update .env with your database credentials
echo 2. Run: python -m uvicorn app.main:app --reload
echo 3. Visit: http://localhost:8000/docs
echo.
pause
