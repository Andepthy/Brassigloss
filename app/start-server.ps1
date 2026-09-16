$node = "C:\Users\Andepthy\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$app = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:Path = "$(Split-Path $node);$env:Path"
Set-Location $app
Start-Process -FilePath $node -ArgumentList ".\node_modules\vite\bin\vite.js", "--host" -WindowStyle Hidden
Start-Sleep 2
Start-Process "http://localhost:5173"
Write-Host "Server started. Close this window anytime."
