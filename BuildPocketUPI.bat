@echo off
title PocketUPI Build System

echo ============================
echo       POCKETUPI BUILDER
echo ============================

echo.
echo [1/4] Installing dependencies...
call npm ci

if errorlevel 1 goto error

echo.
echo [2/4] Building React application...
call npm run build

if errorlevel 1 goto error

echo.
echo [3/4] Syncing Capacitor...
call npx cap sync android

if errorlevel 1 goto error

echo.
echo [4/4] Building Android APK...

cd android
call gradlew.bat assembleDebug

if errorlevel 1 goto error

echo.
echo ============================
echo       BUILD SUCCESSFUL
echo ============================

echo APK location:
echo android\app\build\outputs\apk\debug\app-debug.apk

pause
exit /b 0

:error
echo.
echo BUILD FAILED!
pause
exit /b 1