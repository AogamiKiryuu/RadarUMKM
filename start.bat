@echo off
chcp 65001 >nul
title Prediksi Tren Pasar — Starter

echo.
echo ============================================================
echo   Aplikasi Prediksi Tren Pasar UMKM Bogor
echo ============================================================
echo.
echo   Flask API  : https://radarumkmbogor-api.onrender.com (hosted)
echo.

:: ── Cek Node.js ──────────────────────────────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js tidak ditemukan. Pastikan Node.js sudah terinstall dan ada di PATH.
    pause
    exit /b 1
)

:: ── Direktori ────────────────────────────────────────────────────────────────
set ROOT=%~dp0

:: ── Jalankan Nuxt Dev di jendela CMD terpisah ────────────────────────────────
echo [1/1] Memulai Nuxt Dev  -^>  http://localhost:3000
start "Nuxt Dev Server" cmd /k "cd /d "%ROOT%" && npm run dev"

echo.
echo ============================================================
echo   Nuxt Web   : http://localhost:3000
echo   Flask API  : https://radarumkmbogor-api.onrender.com
echo.
echo   Tutup jendela Nuxt untuk menghentikan layanan.
echo ============================================================
echo.
pause
