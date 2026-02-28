# Aplikasi Prediksi Tren Pasar UMKM Bogor

> Sistem prediksi daya tarik produk dan rekomendasi strategi bisnis untuk UMKM Kota & Kabupaten Bogor berbasis Text Mining dan Machine Learning.

🌐 **Live:** [radarumkm-production.up.railway.app](https://radarumkm-production.up.railway.app)

---

## Deskripsi

Aplikasi ini membantu pelaku UMKM Bogor untuk:

1. **Memprediksi peluang laku** suatu produk di marketplace (Tokopedia, Shopee, Lazada) menggunakan model Machine Learning yang dilatih dari data scraping nyata.
2. **Mendapatkan rekomendasi strategi bisnis** berdasarkan analisis kompetitor real-time dari database — mencakup strategi harga, kualitas, kompetisi, dan marketing.

---

## Deployment

| Layanan | Platform | URL |
|---|---|---|
| Aplikasi Web (Nuxt) | Railway | [radarumkm-production.up.railway.app](https://radarumkm-production.up.railway.app) |
| Database (PostgreSQL) | Railway | *(internal, via DATABASE_URL)* |
| ML API (Flask) | Render | [radarumkmbogor-api.onrender.com](https://radarumkmbogor-api.onrender.com) |
| Flask Health Check | Render | [radarumkmbogor-api.onrender.com/health](https://radarumkmbogor-api.onrender.com/health) |

---

## Teknologi

| Layer | Stack |
|---|---|
| Frontend | Nuxt 4 + Vue 3 + TypeScript |
| UI Framework | Nuxt UI v4 (Tailwind CSS v4) |
| Database | PostgreSQL + Prisma ORM v7 |
| Authentication | nuxt-auth-utils |
| ML Backend | Flask (Python 3.12) + scikit-learn + PySastrawi |
| Model | Random Forest (.joblib) |
| Hosting Web | Railway (Docker) |
| Hosting ML API | Render |

---

## Fitur

- **Login & Register** — autentikasi berbasis session
- **Dashboard** — statistik ringkasan prediksi dan rekomendasi
- **Prediksi Tren Pasar** — input nama produk, kategori, harga → prediksi probabilitas daya tarik + narasi alasan + daftar kompetitor
- **Rekomendasi Bisnis** — analisis strategi harga, rating, kompetisi, marketing + skor peluang 0–100
- **Riwayat Prediksi** — tersimpan di browser (localStorage), klik untuk load ulang
- **Integrasi Prediksi → Rekomendasi** — tombol "Lihat Rekomendasi" meneruskan data prediksi ke halaman rekomendasi secara otomatis

---

## Struktur Proyek

```
prediksi-tren-pasar/
├── app/
│   ├── pages/
│   │   ├── index.vue           # Login / Register
│   │   ├── dashboard.vue       # Dashboard
│   │   ├── prediksi.vue        # Prediksi Tren Pasar
│   │   └── rekomendasi.vue     # Rekomendasi Bisnis
│   ├── middleware/
│   │   └── auth.ts             # Route guard
│   └── generated/prisma/       # Prisma generated client
├── server/
│   ├── api/
│   │   ├── auth/               # Login, Register, Logout
│   │   ├── dashboard/          # Dashboard statistics
│   │   ├── predictions/        # Simpan prediksi
│   │   └── recommendations/    # Analisis & simpan rekomendasi
│   └── plugins/
│       └── migrate.ts          # Auto migration + seeding saat server start
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # SQL migration files
├── scripts/
│   └── import-products.js      # Script seeder manual (opsional)
├── data/
│   ├── raw/                    # Dataset mentah hasil scraping
│   └── processed/              # Dataset setelah preprocessing
├── docs/
│   ├── sistem-prediksi.md      # Dokumentasi teknis prediksi
│   └── sistem-rekomendasi.md   # Dokumentasi teknis rekomendasi
├── Dockerfile                  # Docker build untuk Railway
├── railway.toml                # Konfigurasi Railway deployment
├── start.bat                   # Script dev lokal (Windows)
├── start.ps1                   # Script dev lokal (PowerShell)
└── nuxt.config.ts
```

---

## Cara Menjalankan (Development Lokal)

### Prasyarat

- **Node.js** >= 20.19
- **PostgreSQL** berjalan di port 5432

### 1. Clone & Install

```bash
npm install
```

### 2. Setup Environment

Buat file `.env` di root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/prediksi_tren_pasar"
NUXT_SESSION_PASSWORD="ganti-dengan-string-acak-minimal-32-karakter"
FLASK_API_URL="https://radarumkmbogor-api.onrender.com"
```

> Flask ML API sudah di-host di Render — tidak perlu install Python lokal.

### 3. Setup Database

```bash
npx prisma migrate dev
node scripts/import-products.js
```

### 4. Jalankan

```bash
# Cara mudah (Windows)
start.bat

# Atau manual
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Environment Variables (Production / Railway)

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL Railway |
| `NUXT_SESSION_PASSWORD` | String acak >= 32 karakter untuk enkripsi session |
| `FLASK_API_URL` | `https://radarumkmbogor-api.onrender.com` |
| `NODE_ENV` | `production` |

---

## Dokumentasi Teknis

| Dokumen | Deskripsi |
|---|---|
| [docs/sistem-prediksi.md](docs/sistem-prediksi.md) | Cara kerja & matematis sistem prediksi ML |
| [docs/sistem-rekomendasi.md](docs/sistem-rekomendasi.md) | Cara kerja & matematis sistem rekomendasi bisnis |

---

## Dataset

Data produk diambil dari scraping marketplace (Tokopedia, Shopee, Lazada) dengan fokus produk UMKM Kota & Kabupaten Bogor. Dataset mencakup:

- Nama produk, kategori, sub kategori
- Harga, jumlah terjual, rating
- Nama toko, URL produk, marketplace
- Label daya tarik (binary: 0 = kurang menarik / 1 = menarik)

Total: **597 produk** tersimpan di database PostgreSQL.

---

## Lisensi

Repositori ini dibuat untuk keperluan akademik program MBKM.