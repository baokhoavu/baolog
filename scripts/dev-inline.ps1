<#
dev-inline.ps1
Starts mock-server as a background job (logs to logs\mock-server.log) and then runs Next dev in the same terminal.
Usage:
  PowerShell: .\scripts\dev-inline.ps1

This keeps the Next dev process in the active session while the mock server runs in the background.
#>
try { Set-Location (Resolve-Path "$(Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)\..") } catch { }

# ensure logs dir
if (-not (Test-Path logs)) { New-Item -ItemType Directory -Path logs | Out-Null }

Write-Output "Starting mock server as background job (logs\mock-server.log)..."
# Start mock server as a background job and redirect its stdout/stderr to a log file
$mockJob = Start-Job -Name MockServer -ScriptBlock {
    param($cwd)
    Set-Location $cwd
    if (-not (Test-Path logs)) { New-Item -ItemType Directory -Path logs | Out-Null }
    # Redirect stdout and stderr to logs/mock-server.log (compatible redirection)
    node .\scripts\mock-server.js 2>&1 | Out-File -FilePath (Join-Path $cwd 'logs\mock-server.log') -Encoding utf8 -Append
} -ArgumentList (Get-Location).Path

Start-Sleep -Milliseconds 800

Write-Output "Mock server job id: $($mockJob.Id). Waiting briefly to let it start..."
Start-Sleep -Seconds 1

Write-Output "Running Next dev in this terminal (CMS_API_URL=http://localhost:4001)"
$env:CMS_API_URL = 'http://localhost:4001'

try {
    npm run dev
} finally {
    Write-Output 'npm dev exited — stopping mock server job...'
    try {
        Get-Job -Name MockServer -ErrorAction SilentlyContinue | Stop-Job -ErrorAction SilentlyContinue | Out-Null
        Get-Job -Name MockServer -ErrorAction SilentlyContinue | Remove-Job -ErrorAction SilentlyContinue | Out-Null
    } catch { }
    Write-Output 'Mock server job stopped. You can inspect logs\mock-server.log for mock server output.'
 
}
