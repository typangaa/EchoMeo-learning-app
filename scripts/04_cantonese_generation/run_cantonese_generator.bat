@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================================
echo Cantonese Vocabulary Generator Runner
echo ================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "cantonese_vocabulary_generator.py" (
    echo ERROR: cantonese_vocabulary_generator.py not found
    echo Please run this script from the 04_cantonese_generation directory
    pause
    exit /b 1
)

:start
echo.
echo Available options:
echo   1. Generate all HSK levels (1-7)
echo   2. Generate specific HSK level
echo   3. Show help and exit
echo.

set /p choice="Select an option (1-3): "

if "%choice%"=="1" goto all_levels
if "%choice%"=="2" goto specific_level
if "%choice%"=="3" goto show_help
echo Invalid choice. Please select 1-3.
pause
goto start

:all_levels
echo.
echo Running Cantonese vocabulary generator for ALL HSK levels (1-7)
echo This may take several hours to complete...
echo.
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    goto end_script
)
echo.
echo Starting generation for all levels...
python cantonese_vocabulary_generator.py
goto end_script

:specific_level
echo.
set /p level="Enter HSK level to process (1-7): "

REM Simple validation
if "%level%"=="1" goto run_level
if "%level%"=="2" goto run_level
if "%level%"=="3" goto run_level
if "%level%"=="4" goto run_level
if "%level%"=="5" goto run_level
if "%level%"=="6" goto run_level
if "%level%"=="7" goto run_level

echo Invalid HSK level. Please enter a number between 1 and 7.
pause
goto specific_level

:run_level
echo.
echo Running Cantonese vocabulary generator for HSK level %level%
echo This may take 1-3 hours depending on the level size...
echo.
python cantonese_vocabulary_generator.py --level %level%
goto end_script

:show_help
echo.
echo Cantonese Vocabulary Generator Help
echo ===================================
echo.
echo This script generates Cantonese vocabulary entries from HSK Chinese data.
echo.
echo Prerequisites:
echo   1. Python 3.7+ installed and in PATH
echo   2. Ollama installed and running (ollama serve)
echo   3. A compatible model pulled (e.g., ollama pull qwen3:latest)
echo.
echo Command line usage:
echo   python cantonese_vocabulary_generator.py [options]
echo.
echo Options:
echo   --level LEVEL     Process specific HSK level (1-7)
echo   --model MODEL     Use specific Ollama model
echo   --debug           Show debug output
echo.
goto end_script

:end_script
echo.
echo ================================================================
echo Script finished! Check the logs directory for detailed logs.
echo Output files are saved in: data/cantonese_generated/
echo ================================================================
echo.
pause