# Aplikasi Prediksi Tren Pasar UMKM Bogor

> Sistem prediksi daya tarik produk dan rekomendasi strategi bisnis untuk UMKM Kota & Kabupaten Bogor berbasis Text Mining dan Machine Learning.

🌐 **Live:** [radar-umkm.vercel.app](https://radar-umkm.vercel.app)

---

## Deskripsi

Aplikasi ini membantu pelaku UMKM Bogor untuk:

1. **Memprediksi peluang laku** suatu produk di marketplace (Tokopedia, Shopee, Lazada) menggunakan model Machine Learning yang dilatih dari data scraping nyata.
2. **Mendapatkan rekomendasi strategi bisnis** berdasarkan analisis kompetitor real-time dari database — mencakup strategi harga, kualitas, kompetisi, dan marketing.
3. **Memantau tren pasar** melalui dashboard analitik berbasis data rill UMKM.

---

## Deployment

| Layanan | Platform | URL |
|---|---|---|
| Aplikasi Web (Nuxt) | Vercel | [radar-umkm.vercel.app](https://radar-umkm.vercel.app) |
| Database (PostgreSQL) | Supabase | *(internal, via DATABASE_URL)* |
| ML API (Flask) | Render | [radarumkmbogor-api.onrender.com](https://radarumkmbogor-api.onrender.com) |
| Flask Health Check | Render | [radarumkmbogor-api.onrender.com/health](https://radarumkmbogor-api.onrender.com/health) |

---

## Teknologi

| Layer | Stack |
|---|---|
| Frontend | Nuxt 4 + Vue 3 + TypeScript |
| UI Framework | Nuxt UI v4 (Tailwind CSS v4) |
| Database | PostgreSQL (Supabase) + Prisma ORM v7 |
| Authentication | nuxt-auth-utils |
| ML Backend | Flask (Python 3.12) + scikit-learn + PySastrawi |
| Model | Random Forest Classifier (.joblib) |
| Hosting Web | Vercel (Serverless Functions) |
| Hosting ML API | Render |

---

## Dokumentasi Lengkap

Sistem ini memiliki dokumentasi komprehensif di dalam folder `docs/`:

| Dokumen | Deskripsi |
|---|---|
| [01-overview.md](docs/01-overview.md) | Gambaran umum sistem, arsitektur, dan alur kerja |
| [02-web-frontend.md](docs/02-web-frontend.md) | Dokumentasi aplikasi web (Nuxt.js / Vue.js) |
| [03-web-backend.md](docs/03-web-backend.md) | Dokumentasi server API (Nitro / Nuxt Server) |
| [04-machine-learning.md](docs/04-machine-learning.md) | Dokumentasi model ML dan Flask API |
| [05-database.md](docs/05-database.md) | Dokumentasi database (Supabase / PostgreSQL) |
| [06-deployment.md](docs/06-deployment.md) | Panduan deployment ke Vercel & Render |
| [07-algoritma-prediksi.md](docs/07-algoritma-prediksi.md) | Perhitungan Matematis & Cara Kerja Algoritma Prediksi |
| [diagrams/](docs/diagrams/) | Berisi diagram Arsitektur Sistem dan ERD |

---

## Struktur Proyek

```
prediksi-tren-pasar/
├── app/
│   ├── pages/                # Halaman Web (Vue)
│   ├── middleware/           # Route guard auth
│   └── generated/prisma/     # Prisma generated client
├── server/
│   ├── api/                  # Nitro API Endpoints
│   └── utils/                # Utility backend (Prisma, pg pool)
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # SQL migration files
├── scripts/
│   └── import-products.js    # Script seeder import data produk
├── data/
│   └── processed/            # Dataset `.csv` setelah preprocessing
├── docs/                     # Folder Dokumentasi Sistem
├── start.bat                 # Script dev lokal (Windows)
├── start.ps1                 # Script dev lokal (PowerShell)
└── nuxt.config.ts            # Konfigurasi Nuxt
```

---

## Cara Menjalankan (Development Lokal)

### Prasyarat

- **Node.js** >= 20.19.0
- **PostgreSQL** berjalan di port 5432 (Atau gunakan Supabase Cloud)

### 1. Clone & Install

```bash
git clone https://github.com/AogamiKiryuu/RadarUMKM.git
cd prediksi-tren-pasar
npm install
```

### 2. Setup Environment

Buat file `.env` di root:

```env
# Koneksi aplikasi via PgBouncer Pooler (port 6543)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Koneksi migrasi direct (port 5432)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

NUXT_SESSION_PASSWORD="ganti-dengan-string-acak-minimal-32-karakter"
FLASK_API_URL="https://radarumkmbogor-api.onrender.com"
```

### 3. Setup Database & Seeding

```bash
npx prisma migrate deploy
node scripts/import-products.js
```

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Dataset

Data produk diambil dari hasil scraping marketplace (Tokopedia, Shopee, Lazada) dengan fokus pada produk UMKM Kota & Kabupaten Bogor. Dataset mencakup fitur:

- Nama produk, kategori, sub kategori, lokasi
- Harga, jumlah terjual, rating, skor popularitas
- Nama toko, URL produk, marketplace
- Label daya tarik (binary: 0 = tidak menarik / 1 = menarik)

Total dataset yang diolah: **1.027 produk** (Tersimpan di tabel `products`).

---

## Lisensi

Repositori ini dibuat untuk keperluan akademik program MBKM.