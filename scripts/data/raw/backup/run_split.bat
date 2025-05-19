@echo off
echo Starting HSK vocabulary file splitting...
python split_hsk_files.py
echo.
echo If successful, the split files should be in the 'splits' directory.
echo Press any key to exit.
pause > nul
