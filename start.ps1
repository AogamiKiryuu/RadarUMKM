# =============================================================================
#  start.ps1  —  Jalankan Nuxt Web (Flask sudah di-host di Render)
# =============================================================================
#  Cara pakai:
#    1. Buka PowerShell di folder root workspace ini
#    2. Set-ExecutionPolicy RemoteSigned -Scope CurrentUser  (sekali saja)
#    3. .\start.ps1
# =============================================================================

$rootDir = $PSScriptRoot

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Aplikasi Prediksi Tren Pasar UMKM Bogor" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Flask API  : https://radarumkmbogor-api.onrender.com (hosted)" -ForegroundColor Green
Write-Host ""

# ── Cek Node tersedia ─────────────────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js tidak ditemukan. Pastikan Node.js sudah terinstall." -ForegroundColor Red
    exit 1
}

# ── Jalankan Nuxt Dev di jendela PowerShell terpisah ─────────────────────────
Write-Host "[1/1] Memulai Nuxt Dev  →  http://localhost:3000" -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$rootDir'; Write-Host 'Nuxt Dev — http://localhost:3000' -ForegroundColor Green; npm run dev"
) -WindowStyle Normal

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Nuxt Web   : http://localhost:3000" -ForegroundColor White
Write-Host "  Flask API  : https://radarumkmbogor-api.onrender.com" -ForegroundColor White
Write-Host ""
Write-Host "  Tutup jendela Nuxt untuk menghentikan layanan." -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
