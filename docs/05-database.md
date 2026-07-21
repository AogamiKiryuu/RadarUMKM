# 05 — Database (Supabase / PostgreSQL)

## Gambaran Umum

Database menggunakan **PostgreSQL** yang di-host di **Supabase** (region: Northeast Asia / Tokyo). Schema dikelola oleh **Prisma v7**.

---

## Skema Database

### Tabel `users`

Menyimpan data akun pengguna aplikasi.

```sql
CREATE TABLE users (
  id         VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR      UNIQUE NOT NULL,
  password   VARCHAR      NOT NULL,     -- bcrypt hash
  name       VARCHAR      NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ               -- auto-update
);
```

**Catatan:** Password **tidak pernah** disimpan dalam plaintext — selalu di-hash dengan `bcrypt` (salt rounds: 10).

---

### Tabel `predictions`

Menyimpan riwayat prediksi yang disimpan oleh user.

```sql
CREATE TABLE predictions (
  id               VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "namaProduk"     VARCHAR     NOT NULL,
  kategori         VARCHAR     NOT NULL,
  "subKategori"    VARCHAR,
  "hargaProduk"    INTEGER     NOT NULL,
  "predictionScore" FLOAT      NOT NULL,  -- 0.0 - 100.0
  "predictionLabel" INTEGER    NOT NULL,  -- 0 atau 1
  insight          TEXT,                  -- narasi singkat
  "createdAt"      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Tabel `products`

Menyimpan 1.027 produk UMKM Bogor dari hasil scraping marketplace. Data ini digunakan oleh:
- Dashboard analitik
- Pencarian kompetitor di `/api/recommendations/analyze`

```sql
CREATE TABLE products (
  id               VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  url              VARCHAR,               -- URL produk di marketplace
  "namaProduk"     VARCHAR     NOT NULL,
  kategori         VARCHAR     NOT NULL,
  "subKategori"    VARCHAR,
  marketplace      VARCHAR,               -- tokopedia | shopee | lazada
  lokasi           VARCHAR,               -- Kota penjual
  "namaToko"       VARCHAR,
  "hargaProduk"    INTEGER     NOT NULL,  -- Harga dalam Rupiah
  "jumlahTerjual"  INTEGER     DEFAULT 0,
  rating           FLOAT       DEFAULT 0,
  "popularityScore" FLOAT,               -- Skor gabungan (penjualan × rating)
  "hargaTier"      INTEGER,              -- 0=murah, 1=menengah, 2=mahal
  "createdAt"      TIMESTAMPTZ DEFAULT NOW()
);
```

**Data produk diisi satu kali** via script `scripts/import-products.js` dari `data/processed/dataset_preprocessed.csv`.

---

### Tabel `_prisma_migrations`

Tabel internal Prisma untuk tracking migrasi yang sudah dijalankan.

```
id | checksum | finished_at | migration_name | applied_steps_count
```

---

## Relasi Antar Tabel

```
users ──< predictions
  (1 user dapat memiliki banyak prediksi)
  (hapus user → hapus semua prediksinya — CASCADE)

products tidak berelasi dengan tabel lain
  (data referensi independen)
```

---

## Koneksi Database

### Connection String Format

**Untuk aplikasi (via Pooler PgBouncer — port 6543):**
```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Untuk migrasi (Direct — port 5432):**
```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**Mengapa dua URL?**
- **Pooler (6543):** Untuk aplikasi — menggunakan PgBouncer connection pooling, cocok untuk serverless (banyak koneksi singkat)
- **Direct (5432):** Untuk migrasi — butuh persistent connection, tidak boleh melalui pooler

### SSL Configuration

Supabase menggunakan self-signed certificate pada koneksi pooler. Konfigurasi di `pg.Pool`:

```typescript
const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },  // Accept self-signed cert
});
```

> **Catatan Keamanan:** `rejectUnauthorized: false` berarti kita tidak memverifikasi CA chain. Untuk production yang lebih secure, bisa menggunakan Supabase CA certificate.

---

## ORM: Prisma v7

### Konfigurasi

**File:** `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"   // Output TypeScript
}

datasource db {
  provider = "postgresql"
  // URL dikonfigurasi via prisma.config.ts, bukan di sini
}
```

**File:** `prisma.config.ts`
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
```

**Perbedaan Prisma v7 dari versi sebelumnya:**
- URL koneksi **tidak** ada di `schema.prisma`, tapi di `prisma.config.ts`
- Generator output adalah **TypeScript source** (bukan compiled JS)
- Memerlukan `@prisma/adapter-pg` + `pg.Pool` untuk koneksi

### Alur Migration

```bash
# Buat migration baru (development)
npx prisma migrate dev --name nama_migration

# Deploy migration ke production (Supabase)
npx prisma migrate deploy

# Generate client setelah schema berubah
npx prisma generate
```

### Prisma Client di Vercel

Di Vercel, `prisma generate` dijalankan otomatis saat build:
```json
// package.json
{
  "scripts": {
    "build": "prisma generate && nuxt build",
    "postinstall": "prisma generate && nuxt prepare"
  }
}
```

File `app/generated/prisma/` di-ignore di git (tidak di-commit) karena selalu di-generate ulang saat build.

---

## Import Data Produk

Script untuk mengisi tabel `products` dari CSV:

**File:** `scripts/import-products.js`

```bash
# Jalankan sekali untuk isi data ke Supabase
node scripts/import-products.js
```

**Proses:**
1. Baca `data/processed/dataset_preprocessed.csv`
2. Truncate tabel `products` (hapus data lama)
3. Insert batch per baris dengan mapping kolom CSV → kolom DB
4. Total: 1.027 produk

**Hanya perlu dijalankan ulang jika:**
- Dataset diperbarui dari scraping baru
- Tabel products di-reset

---

## Backup & Recovery

Supabase Free tier menyediakan backup otomatis harian. Untuk restore:
1. Buka Supabase Dashboard → Database → Backups
2. Pilih titik waktu backup
3. Klik Restore

Untuk migrasi ulang schema dari awal:
```bash
# Reset database lokal (HATI-HATI: menghapus semua data!)
npx prisma migrate reset

# Re-import data produk
node scripts/import-products.js
```
