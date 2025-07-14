@echo off
REM Vietnamese Vocabulary Processor - Windows Batch Runner
REM
REM This script runs the Vietnamese vocabulary processor with selectable input files.
REM It will process the selected Vietnamese vocabulary file and generate enriched data.

echo ========================================
echo Vietnamese Vocabulary Processor
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

REM Display available JSON files
echo Available Vietnamese vocabulary files:
echo ========================================
echo 1. vietnamese_raw_1.json
echo 2. vietnamese_raw_2.json
echo 3. vietnamese_raw_3.json
echo 4. vietnamese_raw_4.json
echo 5. vietnamese_raw_5.json
echo 6. vietnamese_raw_6.json
echo 7. vietnamese_raw_1_backup.json
echo 8. Custom path (enter manually)
echo.

REM Get user selection
set /p CHOICE=Select file to process (1-8): 

REM Set input file based on choice
if "%CHOICE%"=="1" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_1.json
    set OUTPUT_PREFIX=vietnamese_1
) else if "%CHOICE%"=="2" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_2.json
    set OUTPUT_PREFIX=vietnamese_2
) else if "%CHOICE%"=="3" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_3.json
    set OUTPUT_PREFIX=vietnamese_3
) else if "%CHOICE%"=="4" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_4.json
    set OUTPUT_PREFIX=vietnamese_4
) else if "%CHOICE%"=="5" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_5.json
    set OUTPUT_PREFIX=vietnamese_5
) else if "%CHOICE%"=="6" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_6.json
    set OUTPUT_PREFIX=vietnamese_6
) else if "%CHOICE%"=="7" (
    set INPUT_FILE=..\..\data\vietnamese_generated\vietnamese_raw_1_backup.json
    set OUTPUT_PREFIX=vietnamese_1_backup
) else if "%CHOICE%"=="8" (
    echo.
    set /p INPUT_FILE=Enter full path to JSON file: 
    set OUTPUT_PREFIX=vietnamese_custom
) else (
    echo Invalid selection. Exiting.
    pause
    exit /b 1
)

REM Set other parameters
set MODEL=qwen3:latest
set BATCH_SIZE=5

REM Check if input file exists
if not exist "%INPUT_FILE%" (
    echo ERROR: Input file not found: %INPUT_FILE%
    echo Please ensure the Vietnamese vocabulary file exists.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Configuration:
echo ========================================
echo Input file: %INPUT_FILE% ✓
echo Using model: %MODEL%
echo Batch size: %BATCH_SIZE%
echo Output prefix: %OUTPUT_PREFIX%
echo.

REM Display file info
for %%I in ("%INPUT_FILE%") do (
    echo File size: %%~zI bytes
    echo Last modified: %%~tI
)
echo.

REM Ask user for confirmation
echo Ready to process Vietnamese vocabulary.
echo This will:
echo - Load Vietnamese vocabulary from the selected input file
echo - Enrich each item with Chinese translations using %MODEL%
echo - Generate JSON and CSV output files with prefix '%OUTPUT_PREFIX%'
echo - Save progress automatically
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

REM Run the processor with output prefix
python vietnamese_vocabulary_processor.py --input "%INPUT_FILE%" --model "%MODEL%" --batch %BATCH_SIZE% --output-prefix "%OUTPUT_PREFIX%"

REM Check if processing was successful
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Processing failed!
    echo Check the log file for details: vietnamese_processor_debug.log
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Processing completed successfully!
    echo.
    echo Output files generated:
    echo - JSON: ..\..\data\enriched\vietnamese_vocabulary\%OUTPUT_PREFIX%_enriched.json
    echo - CSV:  ..\..\data\enriched\vietnamese_vocabulary\%OUTPUT_PREFIX%_enriched.csv
    echo - Log:  vietnamese_processor_debug.log
    echo ========================================
)

echo.
echo Press any key to exit...
pause >nul
