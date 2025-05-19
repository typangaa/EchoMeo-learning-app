@echo off
echo =====================================================
echo Vietnamese-Chinese Learning Platform
echo Enhanced HSK Vocabulary Processing
echo =====================================================
echo.

set /p mode=Select mode: (1) Extract words, (2) Translate meanings, (3) Convert to JSON: 

if "%mode%"=="1" (
  echo.
  echo Running enhanced HSK word extraction...
  python scripts\extract_hsk_words_enhanced.py
) else if "%mode%"=="2" (
  echo.
  set /p level=Enter HSK level to translate (1-7) or press Enter for all levels: 
  set /p model=Enter model name (default: qwen3:latest): 
  
  if "%model%"=="" set model=qwen3:latest
  
  echo.
  echo Using model: %model%
  echo.
  
  if "%level%"=="" (
    python scripts\translate_meanings.py --model %model%
  ) else (
    python scripts\translate_meanings.py %level% --model %model%
  )
) else if "%mode%"=="3" (
  echo.
  echo Converting CSV to JSON...
  cd output
  python csv_to_json_converter.py
  cd ..
) else (
  echo Invalid selection. Please run again and choose a valid option.
)

echo.
echo =====================================================
echo Process completed!
echo.
echo Press any key to exit.
pause > nul
