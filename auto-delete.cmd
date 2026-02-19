@echo off
setlocal EnableDelayedExpansion

title React Native Full Clean Tool
color 0A

echo ======================================
echo        React Native FULL CLEAN
echo ======================================
echo.

:: Force script to run from its own folder
cd /d "%~dp0"

echo Project Directory:
echo %cd%
echo.

:: Check android folder
if not exist "android" (
    echo ERROR: android folder not found here.
    echo Make sure this file is inside project root.
    goto END
)

:: ----------------------------
:: ANDROID CLEAN
:: ----------------------------
echo.
echo Checking Android build folders...

set found=0

if exist "android\build" (
    echo   - android\build
    set found=1
)
if exist "android\app\build" (
    echo   - android\app\build
    set found=1
)
if exist "android\.gradle" (
    echo   - android\.gradle
    set found=1
)
if exist "android\app\.cxx" (
    echo   - android\app\.cxx
    set found=1
)

if !found! EQU 1 (
    echo.
    choice /M "Delete Android build folders?"
    if errorlevel 2 (
        echo Skipped Android cleanup.
    ) else (
        if exist "android\build" rmdir /s /q "android\build"
        if exist "android\app\build" rmdir /s /q "android\app\build"
        if exist "android\.gradle" rmdir /s /q "android\.gradle"
        if exist "android\app\.cxx" rmdir /s /q "android\app\.cxx"
        echo Android folders deleted.
    )
)

:: ----------------------------
:: NODE MODULES
:: ----------------------------
echo.
if exist "node_modules" (
    choice /M "Delete node_modules?"
    if errorlevel 2 (
        echo Skipped node_modules.
    ) else (
        rmdir /s /q node_modules
        echo node_modules deleted.
    )
)

:: ----------------------------
:: GRADLE CLEAN
:: ----------------------------
echo.
choice /M "Run gradlew clean?"
if errorlevel 2 (
    echo Skipped gradlew clean.
) else (
    cd android
    .\gradlew clean
    cd ..
)

echo.
echo ======================================
echo           CLEAN COMPLETED
echo ======================================

:END
echo.
echo Press any key to exit...
pause >nul
