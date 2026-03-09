@echo off
REM ArogyaMitra Quick Start Script
REM Usage: run aromi

if "%1"=="aromi" (
    echo.
    echo ========================================
    echo   Starting ArogyaMitra Platform
    echo ========================================
    echo.
    
    REM Check if backend .env exists
    if not exist "backend\.env" (
        echo [WARNING] backend\.env file not found!
        echo Please create .env file with your GROQ_API_KEY
        echo.
    )
    
    REM Start Backend Server
    echo [1/2] Starting Backend Server...
    start "ArogyaMitra-Backend" cmd /k "cd /d %~dp0backend && echo === Backend Server (Port 8000) === && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    
    REM Wait for backend to initialize
    timeout /t 3 /nobreak >nul
    
    REM Start Frontend Server
    echo [2/2] Starting Frontend Server...
    start "ArogyaMitra-Frontend" cmd /k "cd /d %~dp0frontend && echo === Frontend Server (Port 5173) === && npm run dev"
    
    echo.
    echo ========================================
    echo   Servers Started Successfully!
    echo ========================================
    echo.
    echo  Backend:  http://localhost:8000
    echo  Frontend: http://localhost:5173
    echo  API Docs: http://localhost:8000/docs
    echo.
    echo  Default Login:
    echo    Username: admin
    echo    Password: admin123
    echo.
    echo ========================================
    echo.
    
) else (
    echo.
    echo Usage: run aromi
    echo.
    echo This command starts both frontend and backend servers.
    echo.
)
