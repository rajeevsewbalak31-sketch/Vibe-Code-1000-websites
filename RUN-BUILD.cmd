@echo off
cd /d "%~dp0"
echo === Site engine ===
echo.
echo [1/3] Legacy PowerShell build (003-022)...
powershell -ExecutionPolicy Bypass -File "scripts\build-all.ps1"
echo.
echo [2/3] Node generator (new folders from sites.json)...
node "scripts\generate-sites.mjs"
echo.
echo [3/3] Sync hub gallery...
node "scripts\sync-hub.mjs"
echo.
echo Done. For Phase 2 bulk: npm run engine:all
pause
