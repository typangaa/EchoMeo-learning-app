@echo off
echo Vietnamese Missing Vocabulary Analysis
echo =====================================
echo.

cd /d "%~dp0"

echo Running Vietnamese vocabulary analysis...
python check_vietnamese_missing_vocabulary.py

echo.
echo Analysis complete! Check the vietnamese_missing_reports folder for results.
echo.
pause
