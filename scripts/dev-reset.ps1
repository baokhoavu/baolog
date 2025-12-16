<#
dev-reset.ps1
Helper to clean up port 3000, remove Next build cache, and start mock-server + Next dev
Usage (PowerShell):
  .\scripts\dev-reset.ps1        # safe defaults
  .\scripts\dev-reset.ps1 -KillAllNode  # also kill all node processes
#>
param(
  [switch]$KillAllNode
)

Write-Output "Checking for process on port 3000..."
try {
  $connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
} catch { $connections = $null }

if ($connections) {
  $pids = $connections.OwningProcess | Select-Object -Unique
  foreach ($procId in $pids) {
    try {
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      Write-Output ("Stopped PID {0} listening on port 3000" -f $procId)
    } catch {
      Write-Output ("Failed to stop PID {0}: {1}" -f $procId, $_)
    }
  }
} else {
  Write-Output "No process found on port 3000."
}

if ($KillAllNode) {
  Write-Output "Stopping all node processes..."
  Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
}

if (Test-Path .next) {
  Write-Output "Removing .next build directory..."
  try { Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; Write-Output ".next removed." } catch { Write-Output ("Failed to remove .next: {0}" -f $_) }
} else { Write-Output ".next not present." }

Write-Output "Launching mock server in a new window..."
Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","node scripts\mock-server.js"
Start-Sleep -Seconds 1

Write-Output "Launching Next dev in a new window with CMS_API_URL=http://localhost:4001..."
Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command","`$env:CMS_API_URL='http://localhost:4001'; npm run dev"

Write-Output "Done. Check the new windows for server output. Use Get-Content dev-server.log -Tail 200 -Wait to follow logs if you redirect output." 
