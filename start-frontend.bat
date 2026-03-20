@echo off
echo ========================================
echo VMAS Frontend - Quick Start
echo ========================================
echo.

cd /d "%~dp0ems-frontend"

echo [1/3] Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo [2/3] Starting development server...
echo.
echo Frontend will be available at: http://localhost:3000
echo Make sure backend is running at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:3000

call npm run dev
