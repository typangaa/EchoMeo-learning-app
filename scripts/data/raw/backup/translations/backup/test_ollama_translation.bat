@echo off
echo =====================================================
echo Ollama Translation Test for HSK Vocabulary
echo =====================================================
echo.
echo This script tests if Ollama is correctly configured for
echo translating Chinese to Vietnamese.
echo.
echo Before running this test, make sure:
echo 1. Ollama is installed and running
echo 2. The Qwen3 model is pulled: ollama pull qwen3
echo.

set /p model=Enter model to test (default: qwen3:latest): 

if "%model%"=="" set model=qwen3:latest

echo.
echo Testing model: %model%
echo.

python3 test_ollama_translation.py %model%

echo.
echo Test completed. If all tests passed, you can use the auto_translate.py
echo script to translate HSK vocabulary.
echo.
echo Press any key to exit.
pause > nul
