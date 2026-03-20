@echo off
REM VMAS Frontend Setup Script

echo ========================================
echo VMAS Frontend Setup Script
echo ========================================
echo.

cd ems-frontend

REM Check for node_modules
if not exist "node_modules\" (
    echo [1/2] Installing frontend dependencies...
    call npm install --silent
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [1/2] Dependencies already installed, skipping...
)
echo.

REM Start the frontend
echo [2/2] Starting React frontend...
echo.
echo ========================================
echo Frontend starting at http://localhost:5173
echo Press Ctrl+C to stop the server
echo ========================================
echo.
call npm run dev
