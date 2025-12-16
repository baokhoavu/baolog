@echo off
REM dev-reset.bat - helper to free port 3000, remove .next, start mock server and Next dev
echo Checking for listener on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do set PID=%%a
if defined PID (
  echo Killing PID %PID%...
  taskkill /PID %PID% /F
) else (
  echo No process found for port 3000.
)

if exist .next (
  echo Removing .next...
  rd /s /q .next
) else (
  echo .next not found.
)

echo Starting mock server in new window...
start cmd /k node scripts\mock-server.js
echo Starting Next dev in new window (CMS_API_URL=http://localhost:4001)...
start cmd /k "set CMS_API_URL=http://localhost:4001 && npm run dev"
echo Done. Check the new windows for output.
