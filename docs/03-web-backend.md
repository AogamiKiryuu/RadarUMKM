# 03 — Web Backend (Nitro Server API)

## Gambaran Umum

Backend aplikasi dibangun dengan **Nitro** (server engine bawaan Nuxt 4). Semua API route ada di folder `server/api/` dan dijalankan sebagai **serverless functions** di Vercel.

---

## Struktur Folder Backend

```
server/
├── api/
│   ├── auth/
│   │   ├── login.post.ts          # POST /api/auth/login
│   │   ├── register.post.ts       # POST /api/auth/register
│   │   └── logout.post.ts         # POST /api/auth/logout
│   ├── dashboard/
│   │   └── stats.get.ts           # GET  /api/dashboard/stats
│   ├── predictions/
│   │   └── save.post.ts           # POST /api/predictions/save
│   ├── recommendations/
│   │   └── analyze.post.ts        # POST /api/recommendations/analyze
│   ├── predict.post.ts            # POST /api/predict (core ML endpoint)
│   ├── flask-health.get.ts        # GET  /api/flask-health
│   └── debug-env.get.ts           # GET  /api/debug-env (sementara, untuk debug)
├── plugins/
│   └── migrate.ts                 # Nitro plugin (dinonaktifkan di production)
└── utils/
    ├── prisma.ts                  # Prisma client singleton
    └── csv-dataset.ts             # Utility agregasi data dashboard
```

---

## API Endpoints

### `POST /api/auth/register`

**File:** `server/api/auth/register.post.ts`

**Deskripsi:** Mendaftarkan pengguna baru.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nama User"
}
```

**Proses:**
1. Validasi field tidak kosong
2. Cek email sudah terdaftar via `prisma.user.findUnique()`
3. Hash password dengan `bcrypt` (salt rounds: 10)
4. Simpan ke tabel `users` via Prisma
5. Set session cookie dengan `setUserSession()`

**Response:**
```json
{ "message": "Registrasi berhasil" }
```

---

### `POST /api/auth/login`

**File:** `server/api/auth/login.post.ts`

**Proses:**
1. Cari user by email di database
2. Bandingkan password dengan `bcrypt.compare()`
3. Set session dengan `setUserSession({ user: { id, email, name } })`

---

### `POST /api/auth/logout`

**File:** `server/api/auth/logout.post.ts`

Hapus session dengan `clearUserSession()`.

---

### `GET /api/dashboard/stats`

**File:** `server/api/dashboard/stats.get.ts`

**Deskripsi:** Mengembalikan semua data untuk dashboard analitik.

**Tidak memerlukan autentikasi.**

**Proses:** Memanggil fungsi-fungsi dari `server/utils/csv-dataset.ts` secara paralel (`Promise.all`):

```typescript
const [stats, marketplaceCounts, categoryCount, ...] = await Promise.all([
  getDashboardStats(),
  getMarketplaceDistribution(),
  getCategoryDistribution(),
  getCategoryTrend(),
  getTopProductsByMarketplace(10),
  getTopProductsByLocation(10),
  getTopProductsByPopularity(10),
  getTopRatedProducts(10),
  getPriceDistribution(),
  getTopKeywords(15),
]);
```

**Response (ringkasan):**
```json
{
  "stats": { "totalProducts": 1027, "avgPrice": 52000, "avgRating": 4.5, "totalSold": 98000 },
  "marketplaceDistribution": [{ "name": "Tokopedia", "count": 340 }, ...],
  "charts": {
    "topProducts": { "labels": [...], "datasets": [...] },
    "marketplace": { ... },
    "categories": { ... },
    "priceDistribution": { ... },
    "topKeywords": { ... }
  }
}
```

---

### `POST /api/predict`

**File:** `server/api/predict.post.ts`

**Deskripsi:** Endpoint inti — meneruskan input ke Flask ML API, memformat response.

**Memerlukan autentikasi** (session aktif).

**Request Body:**
```json
{
  "namaProduk": "Lapis Talas Sentul",
  "kategori": "Makanan",
  "subKategori": "Kue & Roti",
  "hargaProduk": 45000
}
```

**Proses:**
1. Cek session — tolak jika tidak login (401)
2. Validasi field wajib
3. Kirim request ke Flask API dengan fallback:
   - Coba `http://localhost:5000/predict` (lokal)
   - Fallback ke `FLASK_API_URL` (production di Render)
4. Petakan response Flask v3 ke format frontend:
   - `peluang_laku_persen` → `predictionScore`
   - `konteks_harga.segmen` → `konteksHarga.segmen`
   - `kompetitor[]` → `similarProducts[]`
   - `produk_terpopuler` → `produkTerpopuler`
   - `insight_pasar` → `insightPasar`

**Error Handling:**
- Flask tidak bisa dihubungi → 503
- Flask mengembalikan warning/error bisnis → 422

---

### `POST /api/predictions/save`

**File:** `server/api/predictions/save.post.ts`

**Deskripsi:** Menyimpan hasil prediksi ke database untuk riwayat.

**Memerlukan autentikasi.**

**Request Body:**
```json
{
  "namaProduk": "Lapis Talas Sentul",
  "kategori": "Makanan",
  "hargaProduk": 45000,
  "predictionScore": 72.5,
  "predictionLabel": 1,
  "insight": "Produk memiliki potensi baik..."
}
```

Disimpan ke tabel `predictions` di Supabase via Prisma.

---

### `POST /api/recommendations/analyze`

**File:** `server/api/recommendations/analyze.post.ts`

**Deskripsi:** Menganalisis strategi bisnis berdasarkan data kompetitor dari database.

**Memerlukan autentikasi.**

**Request Body:**
```json
{
  "namaProduk": "Keripik Singkong",
  "kategori": "Makanan",
  "subKategori": "Keripik & Snack",
  "hargaProduk": 20000
}
```

**Proses Detail:**

#### 1. Pencarian Kompetitor
```
Query products di Supabase
Filter: kategori sama + keyword nama cocok
Sort: by popularity_score DESC
Limit: 20 produk terdekat
```

#### 2. Hitung 4 Skor Strategi

**Strategi Harga (0-25 poin):**
- Bandingkan `hargaProduk` user vs median harga kompetitor
- Jika harga dalam range 70-130% dari median → skor tinggi
- Jika terlalu mahal (>200%) → skor rendah, saran turunkan harga
- Jika terlalu murah (<50%) → skor sedang, saran pertimbangkan naik

**Strategi Kualitas (0-25 poin):**
- Estimasi rating berdasarkan posisi harga
- Harga sesuai pasar → rating diprediksi baik
- Harga sangat tinggi atau rendah → potensi rating buruk

**Strategi Kompetisi (0-25 poin):**
- Hitung jumlah kompetitor yang ditemukan
- Sedikit kompetitor (<5) → peluang besar (skor tinggi)
- Banyak kompetitor (>15) → persaingan ketat (skor rendah)

**Strategi Marketing (0-25 poin):**
- Analisis berdasarkan keyword nama produk
- Diferensiasi nama → skor lebih tinggi
- Nama generik → skor sedang

#### 3. Skor Total
```
totalScore = skorHarga + skorKualitas + skorKompetisi + skorMarketing
range: 0 - 100
```

**Response:**
```json
{
  "skorTotal": 68,
  "kategoriSkor": "Cukup Berpotensi",
  "dimensi": [
    { "nama": "Strategi Harga", "skor": 20, "rekomendasi": [...] },
    { "nama": "Strategi Kualitas", "skor": 18, "rekomendasi": [...] },
    { "nama": "Strategi Kompetisi", "skor": 15, "rekomendasi": [...] },
    { "nama": "Strategi Marketing", "skor": 15, "rekomendasi": [...] }
  ],
  "kompetitor": [...],
  "totalKompetitor": 12
}
```

---

## Server Utils

### `server/utils/prisma.ts` — Prisma Client Singleton

```typescript
import pg from 'pg';
import { PrismaClient } from '../../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  const isLocal = connectionString.includes('localhost');
  const pool = new pg.Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};
```

**Catatan:** Di production (Vercel), singleton di `globalThis` tidak digunakan — setiap invocasi serverless membuat instance baru. Di dev mode, singleton dipakai agar tidak flood koneksi.

---

### `server/utils/csv-dataset.ts` — Dashboard Data Utility

Menggunakan **`pg` langsung** (bukan Prisma) untuk query dashboard karena lebih reliabel di serverless.

```typescript
// Singleton pool
let _pool: pg.Pool | null = null;

// Cache 5 menit
let _cache: ProductRow[] | null = null;
let _cacheTime = 0;

// Query utama
const { rows } = await pool.query(`
  SELECT url, "namaProduk", kategori, "subKategori", marketplace, lokasi,
         "namaToko", "hargaProduk", "jumlahTerjual", rating, "popularityScore"
  FROM products
`);
```

**Fungsi yang tersedia:**
| Fungsi | Output |
|--------|--------|
| `getProducts()` | Semua produk (cached) |
| `getDashboardStats()` | Total, avg price, avg rating, total sold |
| `getMarketplaceDistribution()` | Count per marketplace |
| `getCategoryDistribution()` | Count per kategori |
| `getCategoryTrend()` | Total terjual + jumlah produk per kategori |
| `getTopProductsByMarketplace(n)` | Top n per marketplace |
| `getTopProductsByLocation(n)` | Top n per lokasi |
| `getTopProductsByPopularity(n)` | Top n by jumlah terjual |
| `getTopRatedProducts(n)` | Top n by rating |
| `getPriceDistribution()` | Count per range harga |
| `getTopKeywords(n)` | Keyword paling sering (exclude stopwords) |
