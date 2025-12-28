@echo off
echo ====================================
echo Rebuilding T3 Platform
echo ====================================
echo.

echo Pulling Docker images first...
docker pull node:22
docker pull php:8.2-apache
docker pull mysql:latest
docker pull redis:latest
echo.

echo ====================================
echo Building t3_app...
echo ====================================
cd t3_app

REM Try cached build first
docker compose build
if %ERRORLEVEL% NEQ 0 (
    echo Cached build failed, trying without cache...
    docker compose build --no-cache
)

echo Starting t3_app...
docker compose up -d
cd ..
echo.

echo ====================================
echo Building t3_system...
echo ====================================
cd t3_system

REM Try cached build first
docker compose build
if %ERRORLEVEL% NEQ 0 (
    echo Cached build failed, trying without cache...
    docker compose build --no-cache
)

echo Starting t3_system...
docker compose up -d
cd ..
echo.

echo ====================================
echo Checking status...
echo ====================================
docker ps
echo.

echo ====================================
echo T3 Platform is running!
echo ====================================
echo Services:
echo   - t3_ui:      http://localhost:5177
echo   - t3_api:     http://localhost:8009
echo   - t3_system:  http://localhost:8000
echo   - PHPMyAdmin: http://localhost:9898
echo.

pause
