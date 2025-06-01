@echo off
echo Vietnamese Vocabulary Comprehensive Analyzer
echo ============================================
echo.

:: Change to the script directory
cd /d "%~dp0"

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

echo Running Vietnamese vocabulary analysis...
echo.

:: Run the main analyzer
python main_vietnamese_analyzer.py

echo.
echo Analysis completed! Check the output directory for results.
echo.
pause
