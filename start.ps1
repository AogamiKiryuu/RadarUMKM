# =============================================================================
#  start.ps1  —  Jalankan Flask API + Nuxt Web secara bersamaan
# =============================================================================
#  Cara pakai:
#    1. Buka PowerShell di folder root workspace ini
#    2. Set-ExecutionPolicy RemoteSigned -Scope CurrentUser  (sekali saja)
#    3. .\start.ps1
# =============================================================================

$rootDir   = $PSScriptRoot
$nuxtDir   = Join-Path $rootDir "prediksi-tren-pasar"
$flaskDir  = Join-Path $nuxtDir  "flask_api"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Aplikasi Prediksi Tren Pasar UMKM Bogor" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Cek Python tersedia ────────────────────────────────────────────────────
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python tidak ditemukan. Pastikan Python sudah terinstall." -ForegroundColor Red
    exit 1
}

# ── 2. Cek Node tersedia ──────────────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js tidak ditemukan. Pastikan Node.js sudah terinstall." -ForegroundColor Red
    exit 1
}

# ── 3. Jalankan Flask API di jendela PowerShell terpisah ─────────────────────
Write-Host "[1/2] Memulai Flask API  →  http://localhost:5001" -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$flaskDir'; Write-Host 'Flask API — http://localhost:5001' -ForegroundColor Green; if (Test-Path '.venv\Scripts\Activate.ps1') { & '.venv\Scripts\Activate.ps1' }; python app.py"
) -WindowStyle Normal

# Beri Flask waktu loading model (~5 detik)
Write-Host "      Menunggu Flask memuat model..." -ForegroundColor DarkGray
Start-Sleep -Seconds 5

# ── 4. Jalankan Nuxt Dev di jendela PowerShell terpisah ──────────────────────
Write-Host "[2/2] Memulai Nuxt Dev   →  http://localhost:3000" -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$nuxtDir'; Write-Host 'Nuxt Dev — http://localhost:3000' -ForegroundColor Green; npm run dev"
) -WindowStyle Normal

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Kedua layanan sedang berjalan di jendela terpisah." -ForegroundColor Green
Write-Host ""
Write-Host "  Flask API  : http://localhost:5001" -ForegroundColor White
Write-Host "  Nuxt Web   : http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "  Tutup jendela masing-masing untuk menghentikan layanan." -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
