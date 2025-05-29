@echo off
echo Vietnamese-Chinese Learning Audio Generator
echo ============================================

rem Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
  echo Python is not installed or not in your PATH.
  echo Please install Python from https://www.python.org/downloads/
  pause
  exit /b 1
)

rem Check if required packages are installed
pip show pandas > nul 2>&1
if %errorlevel% neq 0 (
  echo Installing required packages...
  pip install pandas tqdm
)

rem Create necessary directories
mkdir public\audio 2>nul
mkdir src\data 2>nul

echo Running audio generation script...
python generate_audio.py --input vocabulary_data.csv --passages reading_passages.json --output public/audio

echo.
echo Done! Press any key to exit.
pause > nul
