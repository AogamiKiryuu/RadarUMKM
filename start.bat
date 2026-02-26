@echo off
chcp 65001 >nul
title Prediksi Tren Pasar — Starter

echo.
echo ============================================================
echo   Aplikasi Prediksi Tren Pasar UMKM Bogor
echo ============================================================
echo.

:: ── Cek Python ───────────────────────────────────────────────────────────────
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python tidak ditemukan. Pastikan Python sudah terinstall dan ada di PATH.
    pause
    exit /b 1
)

:: ── Cek Node.js ──────────────────────────────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js tidak ditemukan. Pastikan Node.js sudah terinstall dan ada di PATH.
    pause
    exit /b 1
)

:: ── Direktori ────────────────────────────────────────────────────────────────
set ROOT=%~dp0
set FLASK_DIR=%ROOT%flask_api

:: ── 1. Jalankan Flask API di jendela CMD terpisah ────────────────────────────
echo [1/2] Memulai Flask API  -^>  http://localhost:5001
start "Flask ML API" cmd /k "cd /d "%FLASK_DIR%" && (if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat) && python app.py"

:: Beri Flask waktu loading model
echo       Menunggu Flask memuat model (5 detik)...
timeout /t 5 /nobreak >nul

:: ── 2. Jalankan Nuxt Dev di jendela CMD terpisah ─────────────────────────────
echo [2/2] Memulai Nuxt Dev   -^>  http://localhost:3000
start "Nuxt Dev Server" cmd /k "cd /d "%ROOT%" && npm run dev"

echo.
echo ============================================================
echo   Kedua layanan berjalan di jendela terpisah.
echo.
echo   Flask API  : http://localhost:5001
echo   Nuxt Web   : http://localhost:3000
echo.
echo   Tutup jendela masing-masing untuk menghentikan layanan.
echo ============================================================
echo.
