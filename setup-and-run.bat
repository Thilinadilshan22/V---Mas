@echo off
REM VMAS Backend Quick Setup Script
REM This script helps you quickly set up and run the VMAS backend

echo ========================================
echo VMAS Backend Setup Script
echo ========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL service...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo [OK] MySQL is running
) else (
    echo [WARNING] MySQL service not detected. Please start MySQL manually.
    echo You can start it with: net start MySQL80
)
echo.

REM Check if database exists
echo [2/4] Database setup...
echo Please ensure you have run setup-database.sql in MySQL
echo You can do this by:
echo   1. Opening MySQL Command Line
echo   2. Running: source setup-database.sql
echo.
pause

REM Build the application
echo [3/4] Building application...
call mvnw.cmd clean install -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Please check the error messages above.
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

REM Run the application
echo [4/4] Starting application...
echo.
echo ========================================
echo Application starting...
echo Press Ctrl+C to stop the server
echo.
echo TIP: Open a new terminal and run setup-frontend.bat
echo      to start the React frontend
echo ========================================
echo.
call mvnw.cmd spring-boot:run
