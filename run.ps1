param(
    [Parameter(Position=0)]
    [string]$Command
)

if ($Command -eq "aromi") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   Starting ArogyaMitra Platform" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if backend .env exists
    if (-not (Test-Path ".\backend\.env")) {
        Write-Host "[WARNING] backend\.env file not found!" -ForegroundColor Yellow
        Write-Host "Please create .env file with your GROQ_API_KEY" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Start Backend Server
    Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '=== Backend Server (Port 8000) ===' -ForegroundColor Magenta; uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    
    # Wait for backend to initialize
    Start-Sleep -Seconds 3
    
    # Start Frontend Server
    Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '=== Frontend Server (Port 5173) ===' -ForegroundColor Cyan; npm run dev"
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Servers Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
    Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
    Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Default Login:" -ForegroundColor Cyan
    Write-Host "    Username: admin" -ForegroundColor White
    Write-Host "    Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "Usage: .\run aromi" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This command starts both frontend and backend servers." -ForegroundColor Gray
    Write-Host ""
}
