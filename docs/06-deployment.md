# 06 — Deployment

## Gambaran Umum

| Layanan | Platform | URL |
|---------|----------|-----|
| Web App (Nuxt) | Vercel | https://radar-umkm.vercel.app |
| ML API (Flask) | Render | https://radarumkmbogor-api.onrender.com |
| Database | Supabase | Dashboard: supabase.com |

---

## 1. Vercel — Web App (Nuxt)

### Setup Awal

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project** → Import dari GitHub
3. Vercel auto-detect Nuxt → tidak perlu konfigurasi build khusus

### Environment Variables

Buka **Project → Settings → Environment Variables**, tambahkan:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://...@...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` | Production, Preview, Development |
| `DIRECT_URL` | `postgresql://...@...pooler.supabase.com:5432/postgres` | Production, Preview, Development |
| `NUXT_SESSION_PASSWORD` | String acak min. 32 karakter | Production, Preview, Development |
| `FLASK_API_URL` | `https://radarumkmbogor-api.onrender.com` | Production, Preview, Development |

> **Penting:** Nilai env var di Vercel **tidak** menggunakan tanda kutip (`"`). Masukkan nilai murni tanpa kutip.

> **Setelah mengubah env var**, selalu **Redeploy** agar perubahan berlaku.

### Build Process (Vercel)

Saat push ke `main`, Vercel otomatis menjalankan:

```bash
npm install          # → trigger postinstall
# postinstall:
#   prisma generate  # Generate Prisma client dari schema.prisma
#   nuxt prepare     # Generate Nuxt types

npm run build
# build:
#   prisma generate  # Generate ulang (double-check)
#   nuxt build       # Build production bundle
```

Output build disimpan di `.output/` dan di-deploy sebagai Vercel serverless functions.

### Deployment Otomatis

Setiap `git push` ke branch `main` → Vercel otomatis build dan deploy.

Untuk redeploy manual tanpa push:
- Vercel Dashboard → **Deployments** → klik deployment terbaru → **⋯** → **Redeploy**

### Catatan Serverless Vercel

- Setiap API endpoint berjalan sebagai **serverless function** terpisah
- **Tidak ada persistent memory** antar request (file, global state)
- **Timeout default:** 10 detik (bisa dikonfigurasi hingga 60 detik di plan Pro)
- Koneksi database via **PgBouncer pooler** (port 6543) untuk efisiensi koneksi singkat

---

## 2. Render — Flask ML API

### Setup Awal

1. Buka [render.com](https://render.com) → **New** → **Web Service**
2. Hubungkan repo GitHub (folder `flask_api/`)
3. Konfigurasi:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app` atau `python app.py`
   - **Environment:** Python 3.12

### Free Tier Limitations

- Instance **sleep** setelah 15 menit tidak ada request
- **Cold start** saat bangun: 30–60 detik
- Nuxt menggunakan `timeout: 30000ms` saat memanggil Flask

### Health Check

Vercel memanggil endpoint health check sebelum routing request ke Flask:
```
GET https://radarumkmbogor-api.onrender.com/health
```

---

## 3. Supabase — Database

### Setup Awal

1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Pilih region: **Northeast Asia (Tokyo)** untuk latency optimal dari Indonesia

### Deploy Schema

Setelah project Supabase dibuat, jalankan migration dari lokal:

```bash
# Pastikan DIRECT_URL sudah di-set di .env lokal
npx prisma migrate deploy
```

### Isi Data Produk

```bash
# Isi 1.027 produk dari CSV ke Supabase
node scripts/import-products.js
```

### Connection Strings

Dapatkan dari Supabase Dashboard → **Settings** → **Database** → **Connection string**:

- **Pooler (Transaction mode):** Port 6543 — untuk `DATABASE_URL`
- **Direct connection:** Port 5432 — untuk `DIRECT_URL`

---

## Alur Development Lokal → Production

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                     │
└─────────────────────────────────────────────────────────────┘

1. Edit kode di lokal
   └─> npm run dev (Nuxt dev server di localhost:3000)
   └─> python app.py (Flask di localhost:5000)

2. Test perubahan

3. Push ke GitHub
   git add .
   git commit -m "feat: ..."
   git push

4. Vercel auto-deploy:
   └─> Build ~2-3 menit
   └─> Cek hasil di radar-umkm.vercel.app

5. (Jika ada perubahan schema DB)
   npx prisma migrate deploy  # Deploy ke Supabase

6. (Jika ada perubahan ML model)
   └─> Push ke repo Flask
   └─> Render auto-deploy
```

---

## Troubleshooting Deployment

### Vercel: Error `Can't reach database server at 127.0.0.1:5432`

**Penyebab:** `DATABASE_URL` tidak terbaca di Vercel.

**Fix:**
1. Cek `https://radar-umkm.vercel.app/api/debug-env` → pastikan `hasDbUrl: true`
2. Jika false → re-enter env var di Vercel dashboard dan redeploy

### Vercel: Error `self-signed certificate in certificate chain`

**Penyebab:** SSL config `pg.Pool` tidak mengizinkan self-signed cert.

**Fix:** Pastikan `ssl: { rejectUnauthorized: false }` ada di `pg.Pool` config di `server/utils/csv-dataset.ts` dan `server/utils/prisma.ts`.

### Vercel: Error `Unknown field 'xxx' for select statement on model 'Product'`

**Penyebab:** Prisma client di Vercel ter-generate dari schema lama.

**Fix:** Pastikan `prisma generate` ada di script `build` dan `postinstall` di `package.json`, dan folder `app/generated/` ada di `.gitignore`.

### Render: Timeout saat prediksi

**Penyebab:** Flask sedang cold start (sleep setelah 15 menit idle).

**Fix:** Tunggu 30–60 detik dan coba lagi. Atau gunakan layanan berbayar agar tidak sleep.

### Database: Data produk kosong di dashboard

**Penyebab:** Import data belum dijalankan ke Supabase.

**Fix:**
```bash
node scripts/import-products.js
```

---

## Menjalankan Lokal

### Prasyarat

- Node.js >= 20.19.0
- Python >= 3.12
- PostgreSQL (lokal) atau gunakan Supabase untuk lokal juga

### Setup

```bash
# 1. Clone repo
git clone https://github.com/AogamiKiryuu/RadarUMKM.git
cd prediksi-tren-pasar

# 2. Install dependencies Nuxt
npm install

# 3. Setup .env
cp .env.example .env
# Edit .env: isi DATABASE_URL, NUXT_SESSION_PASSWORD, FLASK_API_URL

# 4. Jalankan migration
npx prisma migrate deploy

# 5. Import data produk
node scripts/import-products.js

# 6. Jalankan Flask (terminal terpisah)
cd flask_api
pip install -r requirements.txt
python app.py

# 7. Jalankan Nuxt
npm run dev
```

### Akses

| Layanan | URL Lokal |
|---------|-----------|
| Web App | http://localhost:3000 |
| Flask API | http://localhost:5000 |
| Flask Health | http://localhost:5000/health |
| Prisma Studio | http://localhost:5555 (via `npm run prisma:studio`) |
