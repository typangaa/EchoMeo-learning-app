@echo off
echo =========================================================
echo Vietnamese Translation Workflow for HSK Vocabulary
echo =========================================================
echo.

echo Step 1: Extracting HSK vocabulary words
echo ---------------------------------------------------------
call python extract_hsk_words.py
echo.

echo Step 2: Choose a translation method
echo ---------------------------------------------------------
echo 1. Ollama LLM (local AI, requires Ollama installed)
echo 2. Google Translate (online service, requires internet)
echo 3. Skip auto-translation (manual translation only)
echo.
set /p translation_method=Choose translation method (1-3): 

if "%translation_method%"=="1" (
  echo.
  echo Using Ollama LLM for translation
  echo ---------------------------------------------------------
  echo First, let's test if Ollama is working correctly
  cd translations
  call test_ollama_translation.bat
  echo.
  echo If the test was successful, let's proceed with translation
  call auto_translate.bat
  cd ..
  echo.
) else if "%translation_method%"=="2" (
  echo.
  echo Using Google Translate
  echo ---------------------------------------------------------
  echo This requires internet connection and Python packages: requests, googletrans==4.0.0-rc1
  echo.
  set /p install_packages=Do you want to install required packages? (y/n): 
  
  if /i "%install_packages%"=="y" (
    pip install requests googletrans==4.0.0-rc1
  )
  
  cd translations
  
  echo Before proceeding, we need to create a copy of auto_translate.py for Google Translate
  echo (This will overwrite any existing auto_translate_google.py)
  copy auto_translate.py auto_translate_google.py > nul
  
  set /p level=Enter HSK level to translate (1-7) or press Enter for all levels: 
  
  if "%level%"=="" (
    python auto_translate_google.py
  ) else (
    python auto_translate_google.py %level%
  )
  cd ..
  echo.
) else (
  echo.
  echo Skipping auto-translation
  echo.
)

echo Step 3: Edit translations manually
echo ---------------------------------------------------------
echo Now you can edit the CSV files in the "translations" folder.
echo - Open them in Excel, LibreOffice, or any spreadsheet software
echo - Add or improve Vietnamese translations
echo - Save the files in CSV format (UTF-8 encoding)
echo.
echo For better translation quality:
echo - Focus on one HSK level at a time
echo - Use consistent translations for related words
echo - Consider the context from English meanings
echo.
set /p open_files=Do you want to open the translations folder now? (y/n): 

if /i "%open_files%"=="y" (
  start "" translations
)

echo Press any key when you've finished editing the translations...
pause > nul

echo Step 4: Converting CSV back to JSON
echo ---------------------------------------------------------
cd translations
call python csv_to_json_converter.py
cd ..
echo.

echo Step 5: Updating the application
echo ---------------------------------------------------------
echo The translation files have been created and updated.
echo You can now:
echo 1. Run your application
echo 2. Navigate to /admin/translations to see the progress
echo 3. Test the translations in the HSK vocabulary section
echo.

echo Would you like to see translation statistics?
set /p show_stats=Show translation statistics? (y/n): 

if /i "%show_stats%"=="y" (
  echo.
  echo Opening the translation admin page in your application...
  echo (This will only work if your app is running)
  start "" http://localhost:5173/#/admin/translations
)

echo.
echo Workflow complete!
echo =========================================================
echo.
pause
