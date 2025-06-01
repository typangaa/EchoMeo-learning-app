@echo off
REM Launch Vietnamese Vocabulary Processor
REM
REM This script launches the Vietnamese vocabulary processor from the main directory.

echo ========================================
echo Vietnamese Vocabulary Processor Launcher
echo ========================================
echo.

REM Change to the vietnamese processor directory
cd /d "%~dp0vietnamese_vocabulary_processor"

REM Check if the directory exists
if not exist "vietnamese_vocabulary_processor.py" (
    echo ERROR: Vietnamese vocabulary processor not found!
    echo Please ensure the vietnamese_vocabulary_processor directory exists.
    pause
    exit /b 1
)

echo Launching Vietnamese Vocabulary Processor...
echo.

REM Run the processor
call run_processor.bat

REM Return to original directory
cd /d "%~dp0"

echo.
echo Returned to main vocabulary processing directory.
pause
