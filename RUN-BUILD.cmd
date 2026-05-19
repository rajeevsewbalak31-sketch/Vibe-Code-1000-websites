@echo off
cd /d "%~dp0"
echo Building websites 003-022...
powershell -ExecutionPolicy Bypass -File "scripts\build-all.ps1"
if exist "scripts\generate-sites.mjs" node "scripts\generate-sites.mjs"
echo.
echo Done. Open any site folder and double-click index.html
pause
