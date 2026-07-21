# 02 — Web Frontend (Nuxt 4 / Vue 3)

## Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Nuxt | ^4.3.1 | Full-stack framework (SSR + API) |
| Vue | ^3.5.28 | Reactive UI library |
| Nuxt UI | ^4.5.0 | Komponen UI (Button, Input, Modal, dll) |
| Pinia | ^3.0.4 | State management |
| Chart.js + vue-chartjs | ^4.5.1 | Visualisasi grafik di dashboard |
| nuxt-auth-utils | ^0.5.29 | Manajemen session autentikasi |
| wordcloud | ^1.2.3 | Word cloud keyword produk |

---

## Struktur Folder Frontend

```
app/
├── app.vue                  # Root Vue component
├── assets/
│   └── css/
│       └── main.css         # Global CSS (Tailwind v4 base)
├── layouts/
│   └── default.vue          # Layout utama: sidebar + header
├── middleware/
│   └── auth.ts              # Route guard — redirect ke / jika belum login
├── pages/
│   ├── index.vue            # Halaman Login & Register
│   ├── dashboard.vue        # Halaman Dashboard Analitik
│   ├── prediksi.vue         # Halaman Prediksi Tren Pasar
│   └── rekomendasi.vue      # Halaman Rekomendasi Bisnis
└── generated/
    └── prisma/              # Auto-generated Prisma client (diabaikan git)
```

---

## Halaman-Halaman

### 1. `index.vue` — Login & Register

**Fungsi:** Pintu masuk aplikasi. User belum login di-redirect ke sini oleh middleware.

**Fitur:**
- Tab toggle antara form Login dan Register
- Validasi field di client-side sebelum submit
- Simpan nama user ke `localStorage` untuk ditampilkan di UI
- Redirect otomatis ke `/dashboard` setelah berhasil login

**Alur:**
```
User isi form → klik Login → POST /api/auth/login
                           → server validasi password (bcrypt.compare)
                           → setUserSession (cookie)
                           → redirect ke /dashboard
```

---

### 2. `dashboard.vue` — Dashboard Analitik

**Fungsi:** Menampilkan statistik pasar dari 1.027 produk UMKM Bogor di Supabase.

**Fitur:**
- **Stats cards:** Total produk, rata-rata harga, rata-rata rating, total terjual
- **Pie chart:** Distribusi marketplace (Tokopedia, Shopee, Lazada)
- **Bar chart:** Top 10 produk terlaris
- **Bar chart:** Top 10 produk rating tertinggi
- **Doughnut chart:** Distribusi kategori produk
- **Line chart:** Distribusi kisaran harga (0-50k, 50-100k, 100-200k, 200k+)
- **Tabel:** Tren penjualan per kategori (total terjual + jumlah produk)
- **Tabel per marketplace:** Top 10 produk terlaris di Tokopedia, Shopee, Lazada
- **Tabel per lokasi:** Top produk berdasarkan Bogor, Jakarta, Bekasi, dll
- **Word cloud:** Keyword paling sering muncul di nama produk

**Data Source:**
```
GET /api/dashboard/stats
→ pg.Pool query tabel products di Supabase
→ Agregasi di server (JavaScript)
→ JSON response → Chart.js render
```

**Cache:** Data di-cache 5 menit di memori server untuk efisiensi.

---

### 3. `prediksi.vue` — Prediksi Tren Pasar

**Fungsi:** Form prediksi daya tarik produk menggunakan model ML.

**Input User:**
| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| Nama Produk | Text | ✅ | Nama produk yang ingin diprediksi |
| Kategori | Dropdown | ✅ | Makanan, Minuman, Pakaian & Fashion, dll |
| Sub Kategori | Dropdown | ❌ | Difilter berdasarkan kategori |
| Harga Produk | Number | ✅ | Dalam Rupiah |

**Output yang Ditampilkan:**
- **Skor peluang laku** (0–100%) dengan warna indikator (merah/kuning/hijau)
- **Kesimpulan** (Sangat Menarik / Cukup Menarik / Kurang Menarik / Tidak Menarik)
- **Badge Segmen Risiko** — posisi harga vs median pasar (Murah / Menengah / Risiko)
- **Alasan prediksi** — list narasi dari ML model
- **Konteks harga** — median pasar, harga kamu, selisih persen
- **Daftar kompetitor** — produk serupa dari dataset dengan harga, rating, terjual
- **Produk terpopuler** di kategori yang sama
- **Insight pasar** — ranking kategori, sub-kategori populer

**Fitur Tambahan:**
- Tombol **"Simpan Prediksi"** — menyimpan hasil ke database (`/api/predictions/save`)
- Tombol **"Lihat Rekomendasi"** — forward data ke halaman rekomendasi via `sessionStorage`
- **Riwayat prediksi** — tersimpan di `localStorage`, klik untuk load ulang

**Segmen Harga:**
| Nilai dari Flask | Ditampilkan di UI |
|-----------------|-------------------|
| Murah | Murah |
| Menengah | Menengah |
| Premium | Risiko |

---

### 4. `rekomendasi.vue` — Rekomendasi Bisnis

**Fungsi:** Analisis strategi bisnis berdasarkan data kompetitor dari database.

**Input:** Bisa dari 3 sumber:
1. Diteruskan dari halaman Prediksi (via `sessionStorage`)
2. Input manual oleh user
3. Memuat ulang dari riwayat

**Output:**
- **Skor peluang keberhasilan** (0–100) dengan indikator warna
- **4 Dimensi Analisis Strategi:**
  - 🎯 Strategi Harga — posisi harga vs kompetitor
  - ⭐ Strategi Kualitas — perkiraan rating vs benchmark
  - 🏆 Strategi Kompetisi — tingkat persaingan di kategori
  - 📢 Strategi Marketing — visibilitas & diferensiasi
- **Rekomendasi aksi spesifik** per dimensi (list bullet)
- **Daftar kompetitor terdekat** dari database Supabase

---

## Middleware Auth

File: `app/middleware/auth.ts`

```typescript
// Semua route kecuali '/' memerlukan session aktif
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (to.path !== '/' && !loggedIn.value) {
    return navigateTo('/');
  }
});
```

---

## State Management (Pinia)

Digunakan untuk meneruskan data prediksi antar halaman:
- Data prediksi dari `prediksi.vue` disimpan ke `sessionStorage` saat klik "Lihat Rekomendasi"
- `rekomendasi.vue` membaca dari `sessionStorage` saat mount

---

## Konfigurasi Nuxt

File: `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-auth-utils'],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    flaskApiUrl: process.env.FLASK_API_URL || 'https://radarumkmbogor-api.onrender.com',
    public: { appName: 'RadarUMKMBogor' },
  },

  nitro: {
    externals: { external: ['pg', 'csv-parse'] },
  },
});
```

**Catatan Penting:**
- `pg` di-set sebagai `external` agar Nitro tidak mem-bundle-nya — penting untuk koneksi DB di Vercel
- `runtimeConfig` server-side (tanpa `public`) **tidak terekspos ke client**
