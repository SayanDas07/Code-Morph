Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Code-Morph Docker Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker is running
Write-Host "[1/2] Checking Docker..." -ForegroundColor Yellow
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Docker not running" }
    Write-Host "  Docker is running!" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "  Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Pull required images
Write-Host ""
Write-Host "[2/2] Pulling language images (one-time download)..." -ForegroundColor Yellow

$images = @("gcc:latest", "python:3-slim", "node:18-slim", "eclipse-temurin:17-jdk")

foreach ($img in $images) {
    Write-Host "  Pulling $img..." -ForegroundColor Gray
    docker pull $img
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  $img ready!" -ForegroundColor Green
    } else {
        Write-Host "  Failed to pull $img" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setup complete! Run: npm run dev" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
