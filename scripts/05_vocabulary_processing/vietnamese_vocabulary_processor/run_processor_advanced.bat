@echo off
setlocal enabledelayedexpansion

REM Vietnamese Vocabulary Processor - Advanced Windows Batch Runner
REM
REM This script runs the Vietnamese vocabulary processor with selectable input files
REM and enhanced configuration options.

echo ========================================
echo Vietnamese Vocabulary Processor v2.0
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python and try again.
    pause
    exit /b 1
)

REM Check if Ollama is running
echo Checking Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo ERROR: Ollama is not running or not accessible
    echo Please start Ollama with: ollama serve
    pause
    exit /b 1
)

echo Ollama is running ✓
echo.

REM Scan for available JSON files dynamically
echo Scanning for available Vietnamese vocabulary files...
echo ========================================

set file_count=0
set "base_path=..\..\data\vietnamese_generated"

REM Check if the directory exists
if not exist "%base_path%" (
    echo ERROR: Vietnamese generated data directory not found: %base_path%
    echo Please ensure the data directory structure is correct.
    pause
    exit /b 1
)

REM List all JSON files in the directory
echo Available files:
for %%f in ("%base_path%\*.json") do (
    set /a file_count+=1
    set "file_!file_count!=%%f"
    set "filename_!file_count!=%%~nxf"
    
    REM Get file info
    for %%I in ("%%f") do (
        set "size_!file_count!=%%~zI"
        set "date_!file_count!=%%~tI"
    )
    
    echo !file_count!. %%~nxf
    echo    Size: !size_%file_count%! bytes ^| Modified: !date_%file_count%!
    echo.
)

REM Add custom option
set /a file_count+=1
set "custom_option=!file_count!"
echo !file_count!. Custom path (enter manually)
echo.

if %file_count% eq 1 (
    echo No JSON files found in %base_path%
    pause
    exit /b 1
)

REM Get user selection
set /p CHOICE=Select file to process (1-%file_count%): 

REM Validate choice
if "%CHOICE%"=="" goto invalid_choice
if %CHOICE% LSS 1 goto invalid_choice
if %CHOICE% GTR %file_count% goto invalid_choice

REM Set input file and output prefix based on choice
if "%CHOICE%"=="%custom_option%" (
    echo.
    set /p INPUT_FILE=Enter full path to JSON file: 
    
    REM Extract filename for output prefix
    for %%I in ("!INPUT_FILE!") do (
        set "FILENAME=%%~nI"
    )
    set OUTPUT_PREFIX=!FILENAME!
) else (
    set "INPUT_FILE=!file_%CHOICE%!"
    set "OUTPUT_PREFIX=!filename_%CHOICE%:~0,-5!"
)

REM Remove any spaces and special characters from output prefix
set "OUTPUT_PREFIX=%OUTPUT_PREFIX: =_%"
set "OUTPUT_PREFIX=%OUTPUT_PREFIX:(=_%"
set "OUTPUT_PREFIX=%OUTPUT_PREFIX:)=_%"

goto file_selected

:invalid_choice
echo Invalid selection. Please enter a number between 1 and %file_count%.
pause
exit /b 1

:file_selected

REM Check if input file exists
if not exist "%INPUT_FILE%" (
    echo ERROR: Input file not found: %INPUT_FILE%
    echo Please ensure the Vietnamese vocabulary file exists.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Configuration Options:
echo ========================================

REM Model selection
echo Available models (common options):
echo 1. qwen3:latest (default - fast, good quality)
echo 2. qwen3:7b (smaller, faster)
echo 3. llama3:latest (alternative model)
echo 4. custom (enter manually)
echo.
set /p MODEL_CHOICE=Select model (1-4, or press Enter for default): 

if "%MODEL_CHOICE%"=="" set MODEL=qwen3:latest
if "%MODEL_CHOICE%"=="1" set MODEL=qwen3:latest
if "%MODEL_CHOICE%"=="2" set MODEL=qwen3:7b
if "%MODEL_CHOICE%"=="3" set MODEL=llama3:latest
if "%MODEL_CHOICE%"=="4" (
    set /p MODEL=Enter model name: 
)
if not defined MODEL set MODEL=qwen3:latest

REM Batch size selection
echo.
echo Batch size options:
echo 1. Small (3 items) - slower, less memory
echo 2. Medium (5 items) - default balance
echo 3. Large (10 items) - faster, more memory
echo 4. Custom size
echo.
set /p BATCH_CHOICE=Select batch size (1-4, or press Enter for default): 

if "%BATCH_CHOICE%"=="" set BATCH_SIZE=5
if "%BATCH_CHOICE%"=="1" set BATCH_SIZE=3
if "%BATCH_CHOICE%"=="2" set BATCH_SIZE=5
if "%BATCH_CHOICE%"=="3" set BATCH_SIZE=10
if "%BATCH_CHOICE%"=="4" (
    set /p BATCH_SIZE=Enter batch size: 
)
if not defined BATCH_SIZE set BATCH_SIZE=5

REM Output options
echo.
set /p CREATE_CSV=Create CSV output? (Y/n): 
if /i "%CREATE_CSV%"=="n" (
    set CSV_OPTION=--no-csv
) else (
    set CSV_OPTION=
)

REM Debug option
echo.
set /p DEBUG_MODE=Enable debug mode? (y/N): 
if /i "%DEBUG_MODE%"=="y" (
    set DEBUG_OPTION=--debug
) else (
    set DEBUG_OPTION=
)

echo.
echo ========================================
echo Final Configuration:
echo ========================================
echo Input file: %INPUT_FILE%
for %%I in ("%INPUT_FILE%") do (
    echo File size: %%~zI bytes
    echo Last modified: %%~tI
)
echo Model: %MODEL%
echo Batch size: %BATCH_SIZE%
echo Output prefix: %OUTPUT_PREFIX%
if defined CSV_OPTION (
    echo CSV output: Disabled
) else (
    echo CSV output: Enabled
)
if defined DEBUG_OPTION (
    echo Debug mode: Enabled
) else (
    echo Debug mode: Disabled
)
echo.
echo Output files will be:
echo - JSON: ..\..\data\enriched\vietnamese_vocabulary\%OUTPUT_PREFIX%_enriched.json
if not defined CSV_OPTION (
    echo - CSV:  ..\..\data\enriched\vietnamese_vocabulary\%OUTPUT_PREFIX%_enriched.csv
)
echo - Progress: ..\..\data\enriched\vietnamese_vocabulary\%OUTPUT_PREFIX%_progress.json
echo - Log: vietnamese_processor_debug.log
echo.

REM Final confirmation
echo Ready to process Vietnamese vocabulary.
echo This will:
echo - Load Vietnamese vocabulary from the selected input file
echo - Enrich each item with Chinese translations using %MODEL%
echo - Generate output files with prefix '%OUTPUT_PREFIX%'
echo - Save progress automatically for resumption if interrupted
echo.
set /p CONFIRM=Continue? (y/N): 

if /i not "%CONFIRM%"=="y" (
    echo Processing cancelled.
    pause
    exit /b 0
)

echo.
echo Starting Vietnamese vocabulary processing...
echo ========================================

REM Build command with all options
set "COMMAND=python vietnamese_vocabulary_processor.py --input "%INPUT_FILE%" --model "%MODEL%" --batch %BATCH_SIZE% --output-prefix "%OUTPUT_PREFIX%" %CSV_OPTION% %DEBUG_OPTION%"

echo Running: %COMMAND%
echo.

REM Run the processor
%COMMAND%

REM Check if processing was successful
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Processing failed!
    echo Check the log file for details: vietnamese_processor_debug.log
    echo.
    echo Common issues:
    echo - Ollama model not available: Try 'ollama pull %MODEL%'
    echo - Out of memory: Try reducing batch size
    echo - Network issues: Check internet connection
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Processing completed successfully!
    echo.
    echo Generated files:
    dir "..\..\data\enriched\vietnamese_vocabulary\%OUTPUT_PREFIX%_*" 2>nul
    echo.
    echo Summary:
    echo - Check the JSON file for enriched vocabulary data
    if not defined CSV_OPTION echo - Check the CSV file for spreadsheet-compatible data
    echo - Review the log file for processing details
    echo ========================================
)

echo.
echo Press any key to exit...
pause >nul
