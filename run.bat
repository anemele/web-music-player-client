@echo off

setlocal

set dist=%~dp0dist
if not exist %dist% call npm run build-only

if %errorlevel% neq 0 exit /b %errorlevel%

set py=%~dp0.venv\Scripts\python.exe
call %py% -m music_player2 %dist% assets %*
