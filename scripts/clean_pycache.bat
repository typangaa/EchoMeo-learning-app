@echo off
echo Removing Python cache directories...
for /d /r "C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning" %%d in (__pycache__) do (
    if exist "%%d" (
        echo Removing: %%d
        rmdir /s /q "%%d"
    )
)
echo Done!
pause