@echo off
setlocal enabledelayedexpansion

:: Cantonese Vocabulary Generator Runner
:: This batch file helps run the Cantonese vocabulary generator with various options

echo.
echo ================================================================
echo Cantonese Vocabulary Generator Runner
echo ================================================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python and make sure it's accessible from command line
    pause
    exit /b 1
)

:: Check if Ollama is running
echo Checking Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: Ollama server does not appear to be running
    echo Please start Ollama before running this script
    echo.
    echo To start Ollama:
    echo   1. Open a new command prompt
    echo   2. Run: ollama serve
    echo   3. Wait for it to start, then run this script again
    echo.
    set /p continue="Do you want to continue anyway? (y/N): "
    if /i not "!continue!"=="y" (
        echo Exiting...
        pause
        exit /b 1
    )
) else (
    echo Ollama connection OK
)

echo.
echo Available options:
echo   1. Generate all HSK levels (1-7)
echo   2. Generate specific HSK level
echo   3. Generate with custom model
echo   4. Generate with debug output
echo   5. Show help and exit
echo.

set /p choice="Select an option (1-5): "

if "%choice%"=="1" goto :all_levels
if "%choice%"=="2" goto :specific_level
if "%choice%"=="3" goto :custom_model
if "%choice%"=="4" goto :debug_mode
if "%choice%"=="5" goto :show_help
goto :invalid_choice

:all_levels
echo.
echo Running Cantonese vocabulary generator for ALL HSK levels (1-7)
echo This may take several hours to complete...
echo.
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    goto :end
)
echo.
echo Starting generation for all levels...
python cantonese_vocabulary_generator.py
goto :end

:specific_level
echo.
set /p level="Enter HSK level to process (1-7): "
if "%level%"=="" goto :invalid_level
if %level% lss 1 goto :invalid_level
if %level% gtr 7 goto :invalid_level

echo.
echo Running Cantonese vocabulary generator for HSK level %level%
echo This may take 1-3 hours depending on the level size...
echo.
python cantonese_vocabulary_generator.py --level %level%
goto :end

:invalid_level
echo Invalid HSK level. Please enter a number between 1 and 7.
goto :specific_level

:custom_model
echo.
echo Available models (common examples):
echo   - qwen3:latest (default)
echo   - llama3.1:latest
echo   - mistral:latest
echo   - codellama:latest
echo.
set /p model="Enter Ollama model name: "
if "%model%"=="" (
    echo No model specified, using default.
    goto :end
)

set /p level="Enter HSK level (1-7, or press Enter for all levels): "
if "%level%"=="" (
    echo Running with model %model% for all levels...
    python cantonese_vocabulary_generator.py --model %model%
) else (
    if %level% lss 1 goto :invalid_level_custom
    if %level% gtr 7 goto :invalid_level_custom
    echo Running with model %model% for HSK level %level%...
    python cantonese_vocabulary_generator.py --level %level% --model %model%
)
goto :end

:invalid_level_custom
echo Invalid HSK level. Please enter a number between 1 and 7.
goto :custom_model

:debug_mode
echo.
set /p level="Enter HSK level (1-7, or press Enter for all levels): "
if "%level%"=="" (
    echo Running with debug output for all levels...
    python cantonese_vocabulary_generator.py --debug
) else (
    if %level% lss 1 goto :invalid_level_debug
    if %level% gtr 7 goto :invalid_level_debug
    echo Running with debug output for HSK level %level%...
    python cantonese_vocabulary_generator.py --level %level% --debug
)
goto :end

:invalid_level_debug
echo Invalid HSK level. Please enter a number between 1 and 7.
goto :debug_mode

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
echo   4. Required Python packages: requests
echo.
echo Input files should be in: data/raw/exclusive/
echo Output files will be saved to: data/cantonese_generated/
echo.
echo Command line usage:
echo   python cantonese_vocabulary_generator.py [options]
echo.
echo Options:
echo   --level LEVEL     Process specific HSK level (1-7)
echo   --model MODEL     Use specific Ollama model
echo   --batch SIZE      Set batch size (default: 3)
echo   --raw-dir DIR     Set input directory
echo   --output-dir DIR  Set output directory
echo   --debug           Show debug output
echo.
echo Examples:
echo   python cantonese_vocabulary_generator.py --level 1
echo   python cantonese_vocabulary_generator.py --model llama3.1:latest
echo   python cantonese_vocabulary_generator.py --level 2 --debug
echo.
goto :end

:invalid_choice
echo Invalid choice. Please select 1-5.
pause
goto :start

:end
echo.
echo ================================================================
echo Generation complete! Check the logs directory for detailed logs.
echo Output files are saved in: data/cantonese_generated/
echo ================================================================
echo.
pause