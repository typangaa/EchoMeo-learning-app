@echo off
echo =====================================================
echo Installing Required Python Packages
echo =====================================================
echo.
echo This script will install the Python packages required for
echo the Ollama-based translation system.
echo.

set /p install=Install required packages? (y/n): 

if /i "%install%"=="y" (
  pip install -r requirements.txt
  echo.
  echo Installation completed! You should now be able to run the translation scripts.
) else (
  echo.
  echo Installation cancelled.
)

echo.
echo Press any key to exit.
pause > nul
