# Aplikasi Prediksi Tren Pasar UMKM Bogor

> Sistem prediksi daya tarik produk dan rekomendasi strategi bisnis untuk UMKM Kota & Kabupaten Bogor berbasis Text Mining dan Machine Learning.

---

## Deskripsi

Aplikasi ini membantu pelaku UMKM Bogor untuk:

1. **Memprediksi peluang laku** suatu produk di marketplace (Tokopedia, Shopee, Lazada) menggunakan model Machine Learning yang dilatih dari data scraping nyata.
2. **Mendapatkan rekomendasi strategi bisnis** berdasarkan analisis kompetitor real-time dari database — mencakup strategi harga, kualitas, kompetisi, dan marketing.

---

## Teknologi

| Layer | Stack |
|---|---|
| Frontend | Nuxt 4 + Vue 3 + TypeScript |
| UI Framework | Nuxt UI v4 (Tailwind CSS v4) |
| Database | PostgreSQL + Prisma ORM |
| Authentication | nuxt-auth-utils |
| ML Backend | Flask (Python 3.12) + scikit-learn + PySastrawi |
| Model | Random Forest / Gradient Boosting (`.joblib`) |

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
├── server/api/
│   ├── auth/                   # Login, Register, Logout
│   ├── dashboard/stats.get.ts  # Dashboard statistics
│   ├── predictions/save.post.ts
│   └── recommendations/analyze.post.ts
├── flask_api/
│   ├── app.py                  # Flask ML API (port 5001)
│   ├── model_umkm_bogor.joblib # Model ML terlatih
│   ├── dataset_umkm_bogor.csv  # Dataset produk Bogor
│   └── requirements.txt
├── prisma/
│   └── schema.prisma           # Database schema
├── data/
│   ├── raw/                    # Dataset mentah hasil scraping
│   └── processed/              # Dataset setelah preprocessing
├── docs/
│   ├── sistem-prediksi.md      # Dokumentasi teknis prediksi
│   └── sistem-rekomendasi.md   # Dokumentasi teknis rekomendasi
├── start.bat                   # Script menjalankan semua server (Windows)
├── start.ps1                   # Script menjalankan semua server (PowerShell)
└── nuxt.config.ts
```

---

## Cara Menjalankan

### Prasyarat

- **Node.js** >= 18
- **Python** 3.12
- **PostgreSQL** berjalan di port 5432

### 1. Clone & Install

```bash
# Install dependencies Nuxt
npm install

# Install dependencies Flask
cd flask_api
pip install -r requirements.txt
cd ..
```

### 2. Setup Environment

Buat file `.env` di root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/prediksi_tren_pasar"
NUXT_SESSION_PASSWORD="ganti-dengan-string-acak-minimal-32-karakter"
FLASK_API_URL="http://127.0.0.1:5001"
```

### 3. Setup Database

```bash
# Jalankan migrasi
npx prisma migrate deploy
```

### 4. Jalankan Aplikasi

**Cara mudah — satu klik (Windows):**

```
Klik dua kali start.bat
```

**Atau manual:**

```bash
# Terminal 1 — Flask API
cd flask_api
python app.py

# Terminal 2 — Nuxt
npm run dev
```

### 5. Akses

| Layanan | URL |
|---|---|
| Aplikasi Web | http://localhost:3000 |
| Flask ML API | http://localhost:5001 |
| Flask Health Check | http://localhost:5001/health |

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
- Label daya tarik (binary: 0 / 1)

---

## Lisensi

Repositori ini dibuat untuk keperluan akademik program MBKM.
