# 01 — Gambaran Umum Sistem

## Apa itu RadarUMKMBogor?

**RadarUMKMBogor** adalah aplikasi web berbasis Machine Learning yang membantu pelaku UMKM Kota & Kabupaten Bogor untuk:

1. **Memprediksi peluang laku** suatu produk di marketplace (Tokopedia, Shopee, Lazada)
2. **Mendapatkan rekomendasi strategi bisnis** berdasarkan analisis kompetitor real-time
3. **Memantau tren pasar** melalui dashboard analitik berbasis data 1.027 produk UMKM Bogor

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                     USER (Browser)                      │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL (radar-umkm.vercel.app)             │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │         NUXT 4 / NITRO SERVER                   │   │
│   │                                                 │   │
│   │  ┌──────────────┐   ┌────────────────────────┐  │   │
│   │  │  Vue 3 SPA   │   │   Server API (Nitro)   │  │   │
│   │  │  (Frontend)  │   │   /api/predict         │  │   │
│   │  │              │   │   /api/auth/*          │  │   │
│   │  │  - Dashboard │   │   /api/dashboard/stats │  │   │
│   │  │  - Prediksi  │   │   /api/recommendations │  │   │
│   │  │  - Rekomen-  │   │   /api/predictions/*   │  │   │
│   │  │    dasi      │   │                        │  │   │
│   │  └──────────────┘   └──────────┬─────────────┘  │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────┬───────────────────┘
              ┌──────────────────────┘
              │
     ┌────────┴──────────────────────┐
     │                               │
     ▼                               ▼
┌─────────────────────┐   ┌─────────────────────────────┐
│  SUPABASE           │   │  RENDER                     │
│  (PostgreSQL)       │   │  (Flask ML API)             │
│                     │   │                             │
│  - users            │   │  /predict   → ML model      │
│  - predictions      │   │  /health    → health check  │
│  - products (1027)  │   │                             │
└─────────────────────┘   └─────────────────────────────┘
```

---

## Alur Kerja Utama

### 1. Autentikasi
```
User → Register/Login → Nuxt Server → bcrypt hash → Supabase (tabel users)
                                    ↓
                              Session cookie (nuxt-auth-utils)
```

### 2. Prediksi Tren
```
User input → /api/predict → Flask API (Render) → Model ML (Random Forest)
                          ↓                    ↓
                    pg (Supabase)         Analisis kompetitor
                  (ambil data produk)     dari dataset lokal
                          ↓
                   Hasil prediksi → Frontend → Tampilkan hasil
```

### 3. Dashboard
```
User buka dashboard → /api/dashboard/stats → pg.Pool → Supabase
                                           ↓
                                   Query tabel products
                                   (1027 baris)
                                           ↓
                               Agregasi di server (JS):
                               - Distribusi marketplace
                               - Distribusi kategori
                               - Top produk
                               - Distribusi harga
                               - Word cloud keyword
                                           ↓
                                   JSON → Chart.js → UI
```

### 4. Rekomendasi Bisnis
```
User input → /api/recommendations/analyze → Supabase (pg direct)
                                          ↓
                               Cari produk kompetitor
                               Filter by nama/kategori
                                          ↓
                               Hitung 4 dimensi skor:
                               - Strategi Harga
                               - Strategi Kualitas
                               - Strategi Kompetisi
                               - Strategi Marketing
                                          ↓
                               Skor gabungan (0-100)
                               + daftar rekomendasi aksi
                                          ↓
                                   JSON → Frontend UI
```

---

## Komponen Sistem

| Komponen | Teknologi | Host | Fungsi |
|----------|-----------|------|--------|
| Web App | Nuxt 4 + Vue 3 | Vercel | Frontend + Backend API |
| ML API | Python Flask | Render | Model prediksi ML |
| Database | PostgreSQL | Supabase | Data produk, user, prediksi |
| ORM | Prisma v7 | - | Schema management & migration |

---

## Environment Variables

| Variable | Digunakan Di | Fungsi |
|----------|-------------|--------|
| `DATABASE_URL` | Vercel + Lokal | Koneksi PostgreSQL (pooler, port 6543) |
| `DIRECT_URL` | Lokal (migrate) | Koneksi PostgreSQL direct (port 5432) |
| `NUXT_SESSION_PASSWORD` | Vercel + Lokal | Enkripsi session cookie |
| `FLASK_API_URL` | Vercel + Lokal | URL Flask ML API di Render |
