@echo off
cd /d "%~dp0"
set PATH=C:\Users\Andepthy\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
echo Rebuilding translations.json...
node scripts\preprocess.mjs
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
