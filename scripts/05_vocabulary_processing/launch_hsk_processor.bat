@echo off
REM Quick launcher for HSK Vocabulary Processor
REM This script changes to the correct directory and runs the processor

echo Launching HSK Vocabulary Processor...
cd /d "%~dp0hsk_vocabulary_processor"
call run_processor.bat
