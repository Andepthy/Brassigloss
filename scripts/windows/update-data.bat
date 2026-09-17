@echo off
cd /d "%~dp0..\.."
echo Rebuilding translations.json...
call pnpm preprocess
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Build failed. Check the error above.
  pause
  exit /b 1
)
echo.
echo Done. translations.json has been updated.
echo Restart the server if it is already running.
pause
