@echo off
REM Batch script to run the HSK vocabulary extraction
echo HSK Vocabulary Simplified Words Extractor
echo ==========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.6 or higher
    pause
    exit /b 1
)

REM Change to the script directory
cd /d "%~dp0"

REM Run the Python script
echo Running extraction script...
python extract_simplified_words.py

echo.
echo Script completed!
pause
