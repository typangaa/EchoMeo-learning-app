@echo off
echo =====================================================
echo Ollama Translation Troubleshooting Helper
echo =====================================================
echo.
echo Based on the logs, there's an issue with Ollama producing JSON output.
echo This script will help you fix the issue.
echo.
echo STEPS TO FIX THE ISSUE:
echo 1. Make sure Ollama is running
echo 2. Try different models to see which one works
echo 3. Run tests in order

echo.
echo First, let's check which models are available:
echo.
python simple_test.py

echo.
echo =====================================================
echo STEP 1: Run the simplified test first
echo =====================================================
echo.
echo This test will try to get a simple JSON response from Ollama.
echo.
set /p model=Enter model to test (default: qwen3:latest): 

if "%model%"=="" set model=qwen3:latest

echo.
python simple_test.py %model%

echo.
echo =====================================================
echo STEP 2: If the simple test passed, try the full test
echo =====================================================
echo.
echo This will run the test_ollama_translation.py script
echo with the updated settings.
echo.
set /p run_full_test=Run the full test now? (y/n): 

if /i "%run_full_test%"=="y" (
  echo.
  python test_ollama_translation.py %model%
)

echo.
echo =====================================================
echo STEP 3: Detailed Debug Mode
echo =====================================================
echo.
echo This will provide comprehensive debugging information
echo about the Ollama API response.
echo.
set /p run_debug=Run detailed debug? (y/n): 

if /i "%run_debug%"=="y" (
  echo.
  python debug_ollama.py %model%
)

echo.
echo =====================================================
echo STEP 4: Try Alternative Approaches
echo =====================================================
echo.
echo This will test different approaches that may work better
echo with models that struggle with JSON formatting.
echo.
set /p run_alt=Try alternative approaches? (y/n): 

if /i "%run_alt%"=="y" (
  echo.
  python alternative_approach.py
)

echo.
echo =====================================================
echo STEP 5: Use the Improved Translator
echo =====================================================
echo.
echo After testing which models and approaches work best,
echo use the improved auto-translator script which is
echo designed to work with simpler prompts.
echo.
set /p run_improved=Run improved translator now? (y/n): 

if /i "%run_improved%"=="y" (
  echo.
  set /p improved_model=Enter model to use (default: %model%): 
  set /p use_two_step=Use two-step translation (think then format)? (y/n): 

  if "%improved_model%"=="" set improved_model=%model%

  if /i "%use_two_step%"=="y" (
    python improved_auto_translate.py --model %improved_model% --two-step
  ) else (
    set /p use_chat=Use chat API instead of generate API? (y/n): 
    if /i "%use_chat%"=="y" (
      python improved_auto_translate.py --model %improved_model% --chat
    ) else (
      python improved_auto_translate.py --model %improved_model%
    )
  )
)

echo.
echo =====================================================
echo SUGGESTIONS IF TESTS FAILED:
echo =====================================================
echo.
echo 1. Try a different model with:
echo    python simple_test.py MODEL_NAME
echo    Some models that might work better:
echo    - llama3.1:latest
echo    - llama3.2:latest
echo    - gemma:latest
echo.
echo 2. Make sure your Ollama is up to date:
echo    Check for updates at https://ollama.com/download
echo.
echo 3. If no models work properly, you can use the Google
echo    Translate option instead with:
echo    python auto_translate_google.py
echo.
echo Press any key to exit...
pause > nul
