$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$pnpm = Get-Command pnpm.cmd -ErrorAction SilentlyContinue

if (-not $pnpm) {
    Write-Error "pnpm was not found. Install pnpm before starting the development server."
    exit 1
}

Set-Location $projectRoot
Start-Process -FilePath $pnpm.Source -ArgumentList "dev", "--host" -WorkingDirectory $projectRoot -WindowStyle Hidden
Start-Sleep 2
Start-Process "http://localhost:5173"
Write-Host "Server started. Close this window anytime."
