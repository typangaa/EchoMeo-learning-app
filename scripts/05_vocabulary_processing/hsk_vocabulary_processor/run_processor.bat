@echo off
setlocal enabledelayedexpansion
REM HSK Vocabulary Processor - Windows Batch File
REM This script runs the HSK vocabulary processor with default settings

echo ==========================================
echo HSK Vocabulary Processor
echo ==========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Check if Ollama is running
echo Checking Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to Ollama
    echo Please ensure Ollama is running: ollama serve
    echo And that Qwen3 model is installed: ollama pull qwen3:latest
    pause
    exit /b 1
)

echo Ollama connection successful!
echo.

:menu
REM Show menu
echo Select processing option:
echo 1. Process all HSK levels (1-7)
echo 2. Process specific HSK level
echo 3. Process with debug output
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "!choice!"=="1" goto process_all
if "!choice!"=="2" goto process_specific
if "!choice!"=="3" goto process_debug
if "!choice!"=="4" goto exit_script
echo Invalid choice. Please try again.
echo.
goto menu

:process_all
echo Processing all HSK levels...
python hsk_vocabulary_processor.py
goto end_processing

:process_specific
set /p level="Enter HSK level (1-7): "
echo Processing HSK level !level!...
python hsk_vocabulary_processor.py --level !level!
goto end_processing

:process_debug
set /p level="Enter HSK level (1-7) or press Enter for all levels: "
if "!level!"=="" (
    echo Processing all HSK levels with debug output...
    python hsk_vocabulary_processor.py --debug
) else (
    echo Processing HSK level !level! with debug output...
    python hsk_vocabulary_processor.py --level !level! --debug
)
goto end_processing

:exit_script
echo Exiting...
exit /b 0

:end_processing
echo.
echo ==========================================
echo Processing completed!
echo Check the log files for details:
echo - hsk_processor_debug.log (detailed debug info)
echo ==========================================
echo.
pause
