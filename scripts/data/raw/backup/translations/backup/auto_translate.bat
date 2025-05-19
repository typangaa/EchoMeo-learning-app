@echo off
echo =====================================================
echo Auto-Translating HSK Vocabulary with Ollama LLM API
echo =====================================================
echo.
echo Before running this script, you need to:
echo 1. Install required Python packages:
echo    pip install requests
echo 2. Install and start Ollama:
echo    https://ollama.com/download
echo 3. Pull the Qwen3 model:
echo    ollama pull qwen3
echo 4. Make sure the Ollama server is running
echo 5. Ensure translation CSV files exist in this directory
echo.

set /p install_packages=Do you want to install the required Python packages now? (y/n): 

if /i "%install_packages%"=="y" (
  echo.
  echo Installing required packages...
  pip install requests
  echo.
)

echo Current settings:
echo - Model: qwen3:latest
echo - API URL: http://localhost:11434/api/generate
echo.

set /p level=Enter HSK level to translate (1-7) or press Enter for all levels: 
set /p model=Enter model name (default: qwen3:latest): 

if "%model%"=="" set model=qwen3:latest

echo.
echo Using model: %model%
echo.

if "%level%"=="" (
  python auto_translate.py --model %model%
) else (
  python auto_translate.py %level% --model %model%
)

echo.
echo =====================================================
echo Translation process completed!
echo.
echo Next steps:
echo 1. Review the translations in the CSV files
echo 2. Convert the CSV files back to JSON:
echo    python csv_to_json_converter.py
echo.
echo Press any key to exit.
pause > nul
