$port = 5173
$conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force
    Write-Host "Server stopped."
} else {
    Write-Host "No server running on port $port."
}