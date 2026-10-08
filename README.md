# RadarUMKMBogor — Aplikasi Prediksi Tren Pasar UMKM Bogor

> Sistem prediksi daya tarik produk dan rekomendasi strategi bisnis untuk UMKM Kota & Kabupaten Bogor berbasis **Text Mining (TF-IDF + Cosine Similarity)** dan **Machine Learning (Random Forest)**.

🌐 **Live:** [radar-umkm.vercel.app](https://radar-umkm.vercel.app) · 🤖 **ML API:** [radarumkmbogor-api.onrender.com](https://radarumkmbogor-api.onrender.com/health)

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Latar Belakang & Rumusan Masalah](#2-latar-belakang--rumusan-masalah)
3. [Tujuan & Manfaat](#3-tujuan--manfaat)
4. [Ruang Lingkup & Batasan](#4-ruang-lingkup--batasan)
5. [Teknologi yang Digunakan](#5-teknologi-yang-digunakan)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Dataset & Preprocessing](#7-dataset--preprocessing)
8. [Metodologi & Algoritma](#8-metodologi--algoritma)
9. [Fitur & Halaman Aplikasi](#9-fitur--halaman-aplikasi)
10. [Alur Kerja Sistem](#10-alur-kerja-sistem)
11. [API Endpoint](#11-api-endpoint)
12. [Desain Database](#12-desain-database)
13. [Deployment](#13-deployment)
14. [Cara Menjalankan (Lokal)](#14-cara-menjalankan-lokal)
15. [Struktur Proyek](#15-struktur-proyek)
16. [Skenario Pengujian (Black-Box)](#16-skenario-pengujian-black-box)
17. [Keterbatasan & Catatan Teknis](#17-keterbatasan--catatan-teknis)
18. [Pengembangan Selanjutnya](#18-pengembangan-selanjutnya)
19. [Panduan Pemetaan ke Laporan](#19-panduan-pemetaan-ke-laporan)
20. [Dokumentasi Lanjutan](#20-dokumentasi-lanjutan)

---

## 1. Ringkasan Proyek

| Item | Keterangan |
|---|---|
| Nama Aplikasi | RadarUMKMBogor |
| Jenis | Aplikasi web (SPA + Server API) dengan layanan ML terpisah |
| Program | MBKM |
| Pengguna Sasaran | Pelaku UMKM Kota & Kabupaten Bogor |
| Sumber Data | Hasil scraping Tokopedia, Shopee, Lazada |
| Jumlah Data | 1.796 baris mentah → **1.027 produk** setelah preprocessing |
| Algoritma Utama | TF-IDF, Cosine Similarity, Random Forest Classifier |
| Repositori | [AogamiKiryuu/RadarUMKM](https://github.com/AogamiKiryuu/RadarUMKM) |

**Tiga fitur inti:**

1. **Prediksi Tren** — memprediksi peluang laku (0–100%) sebuah produk berdasarkan nama, kategori, sub-kategori, dan harga.
2. **Rekomendasi Bisnis** — menghasilkan skor peluang + strategi harga, kualitas, kompetisi, dan marketing berdasarkan data kompetitor.
3. **Dashboard Analitik** — visualisasi kondisi pasar UMKM Bogor (distribusi kategori, harga, marketplace, produk terlaris, keyword populer).

---

## 2. Latar Belakang & Rumusan Masalah

### Latar Belakang (ringkas)

- Pelaku UMKM semakin bergantung pada marketplace (Tokopedia, Shopee, Lazada) untuk berjualan.
- Sebagian besar UMKM menentukan produk dan harga berdasarkan intuisi, tanpa data pembanding kompetitor.
- Data publik marketplace (harga, jumlah terjual, rating) sebenarnya tersedia dan dapat diolah menjadi insight pasar.
- Dibutuhkan alat bantu sederhana yang dapat memberi gambaran **apakah produk berpeluang laku** dan **strategi apa yang perlu diambil**, khusus untuk konteks Bogor.

### Rumusan Masalah

1. Bagaimana mengolah data produk marketplace menjadi dataset yang layak untuk pemodelan?
2. Bagaimana menemukan produk kompetitor yang mirip dengan produk UMKM berdasarkan nama produk?
3. Bagaimana memprediksi daya tarik (peluang laku) suatu produk menggunakan Machine Learning?
4. Bagaimana menyajikan hasil prediksi dan rekomendasi strategi dalam bentuk aplikasi web yang mudah digunakan?

---

## 3. Tujuan & Manfaat

### Tujuan

1. Membangun dataset produk UMKM Bogor dari hasil scraping 3 marketplace.
2. Menerapkan TF-IDF + Cosine Similarity untuk pencarian produk kompetitor serupa.
3. Menerapkan Random Forest untuk memprediksi peluang laku produk.
4. Membangun aplikasi web yang menyajikan prediksi, rekomendasi strategi, dan dashboard pasar.

### Manfaat

| Pihak | Manfaat |
|---|---|
| Pelaku UMKM | Gambaran peluang produk & posisi harga sebelum mulai berjualan |
| Pemerintah/Pendamping UMKM | Gambaran kategori dan produk yang diminati pasar Bogor |
| Akademik | Contoh penerapan text mining + ML pada data e-commerce lokal |

---

## 4. Ruang Lingkup & Batasan

- **Wilayah:** fokus produk UMKM Bogor; dataset juga memuat penjual dari Jakarta, Depok, Bekasi, Tangerang sebagai pembanding.
- **Marketplace:** Tokopedia, Shopee, Lazada.
- **Kategori yang didukung aplikasi (4):**

  | Kategori | Sub-Kategori |
  |---|---|
  | Makanan | Camilan & Snack, Kue & Roti, Lauk & Bahan Makanan, Makanan Tradisional |
  | Minuman | Kopi, Minuman Tradisional, Teh |
  | Pakaian & Fashion | Atasan & Pakaian Kasual, Pakaian Tradisional |
  | Aksesoris & Souvenir | Aksesoris & Souvenir |

- **Data bersifat statis** (snapshot hasil scraping), bukan real-time dari marketplace.
- **Input pengguna** terbatas pada: nama produk, kategori, sub-kategori, harga.
- Prediksi bersifat **estimasi/pendukung keputusan**, bukan jaminan penjualan.

---

## 5. Teknologi yang Digunakan

| Layer | Teknologi | Fungsi |
|---|---|---|
| Frontend | Nuxt 4, Vue 3, TypeScript | Antarmuka pengguna (SPA) |
| UI | Nuxt UI v4 (Tailwind CSS v4), Heroicons | Komponen & styling |
| Visualisasi | Chart.js + vue-chartjs | Grafik dashboard |
| State | Pinia | Manajemen state |
| Backend Web | Nitro (Nuxt Server API) | REST API, proxy ke ML API |
| Autentikasi | nuxt-auth-utils + bcrypt | Session cookie terenkripsi, hash password |
| Database | PostgreSQL (Supabase) | Penyimpanan user & produk |
| ORM | Prisma v7 (`@prisma/adapter-pg`) + `pg` | Akses & migrasi database |
| ML Service | Python 3.12, Flask, scikit-learn, pandas, numpy, PySastrawi, joblib | Model prediksi & pencarian kompetitor |
| Hosting | Vercel (web), Render (ML API), Supabase (DB) | Deployment |

---

## 6. Arsitektur Sistem

Sistem menggunakan arsitektur **3 layanan terpisah**: Web App (Nuxt), ML API (Flask), dan Database (PostgreSQL).

```mermaid
flowchart LR
    U["Pengguna (Browser)"] -->|HTTPS| W

    subgraph Vercel
        W["Nuxt 4 App<br/>Vue 3 SPA + Nitro Server API"]
    end

    subgraph Render
        F["Flask ML API<br/>TF-IDF + Cosine + Random Forest"]
    end

    subgraph Supabase
        D[("PostgreSQL<br/>users, predictions, products")]
    end

    W -->|"POST /predict"| F
    W -->|"Prisma / pg"| D
```

| Komponen | Peran |
|---|---|
| Vue 3 SPA | Halaman Landing, Dashboard, Prediksi, Rekomendasi |
| Nitro Server API | Autentikasi, agregasi statistik dashboard, validasi input, perhitungan skor rekomendasi, proxy ke Flask |
| Flask ML API | Preprocessing teks, pencarian kompetitor (cosine similarity), prediksi Random Forest, insight pasar |
| PostgreSQL | Menyimpan akun pengguna dan 1.027 data produk |

> [!NOTE]
> Kode Flask ML API berada di repositori terpisah. Repositori ini berisi Web App (frontend + backend Nuxt) dan dataset.

---

## 7. Dataset & Preprocessing

### 7.1 Sumber & Ukuran

| File | Baris | Keterangan |
|---|---|---|
| [`data/raw/GabunganTokopedLazadaShopee_Uncleaned.csv`](data/raw/GabunganTokopedLazadaShopee_Uncleaned.csv) | 1.796 | Gabungan hasil scraping 3 marketplace |
| [`data/processed/dataset_preprocessed.csv`](data/processed/dataset_preprocessed.csv) | 1.027 | Dataset bersih + fitur hasil rekayasa |

**Kolom data mentah:** `url_produk, nama_produk, harga_produk, jumlah_terjual, rating, nama_toko, marketplace`

### 7.2 Tahapan Preprocessing

1. **Penggabungan** data dari Tokopedia, Shopee, Lazada.
2. **Pembersihan data**: hapus duplikat, data kosong, dan nilai tidak valid (1.796 → 1.027 baris).
3. **Pembersihan teks** nama produk → `nama_produk_clean` (lowercase, hapus simbol, stopword removal, stemming Sastrawi).
4. **Pelabelan kategori & sub-kategori** produk.
5. **Normalisasi lokasi** → `lokasi_clean` (Bogor, Jakarta, Depok, Bekasi, Tangerang, Lainnya).
6. **Feature engineering**:
   - `harga_log_scaled`, `jumlah_log_scaled`, `rating_scaled` — transformasi log + standardisasi
   - `revenue_proxy_log` — proksi pendapatan (harga × terjual, skala log)
   - `popularity_score` — skor popularitas gabungan (rating × log penjualan)
   - `harga_tier` — 0 = Murah, 1 = Menengah, 2 = Mahal
   - Label encoding: `kategori_encoded`, `sub_kategori_encoded`, `marketplace_encoded`, `lokasi_encoded`
   - One-hot: `mp_*`, `lokasi_*`, serta flag `is_bogor`, `is_makanan`, `is_minuman`, `is_fashion`, `is_souvenir`
7. **Import ke database** via [`scripts/import-products.js`](scripts/import-products.js).

### 7.3 Distribusi Dataset (1.027 produk)

<table>
<tr><td valign="top">

| Kategori | Jumlah |
|---|---|
| Makanan | 416 |
| Pakaian & Fashion | 415 |
| Minuman | 171 |
| Aksesoris & Souvenir | 25 |

</td><td valign="top">

| Marketplace | Jumlah |
|---|---|
| Shopee | 438 |
| Lazada | 342 |
| Tokopedia | 247 |

</td><td valign="top">

| Lokasi | Jumlah |
|---|---|
| Bogor | 606 |
| Jakarta | 279 |
| Depok | 52 |
| Tangerang | 52 |
| Bekasi | 35 |
| Lainnya | 3 |

</td><td valign="top">

| Harga Tier | Jumlah |
|---|---|
| 0 – Murah | 251 |
| 1 – Menengah | 578 |
| 2 – Mahal | 198 |

</td></tr>
</table>

| Sub-Kategori | Jumlah |
|---|---|
| Atasan & Pakaian Kasual | 357 |
| Kue & Roti | 190 |
| Camilan & Snack | 148 |
| Kopi | 143 |
| Pakaian Tradisional | 58 |
| Lauk & Bahan Makanan | 55 |
| Aksesoris & Souvenir | 25 |
| Makanan Tradisional | 23 |
| Minuman Tradisional | 23 |
| Teh | 5 |

### 7.4 Definisi Label Target (Model v4 Resmi)

Produk diberi label **1 (Menarik)** jika volume penjualannya berada di atas nilai tengah persentil 50% dalam kategorinya (*category-stratified ranking*), selain itu **0 (Kurang Menarik)**:

```python
df['rank_terjual_kat'] = df.groupby('kategori')['jumlah_terjual'].rank(method='first', pct=True)
df['label'] = (df['rank_terjual_kat'] > 0.5).astype(int)
```

Metodologi ini menjamin keadilan 50% : 50% di seluruh sektor produk (Makanan 208:208, Minuman 85:86, Pakaian 207:208, Aksesoris 12:13), sehingga produk pakaian tidak dirugikan saat bersaing melawan produk kuliner.

---

## 8. Metodologi & Algoritma

Pipeline prediksi:

```mermaid
flowchart LR
    A["Input Produk<br/>nama, kategori, harga"] --> B["Preprocessing Teks<br/>clean, stopword, stemming"]
    B --> C["TF-IDF<br/>vektorisasi nama"]
    C --> D["Cosine Similarity<br/>cari produk mirip"]
    D --> E["Fitur Turunan<br/>median harga, rasio, tier, jumlah kompetitor"]
    E --> F["Random Forest<br/>predict_proba"]
    F --> G["Peluang Laku (%)<br/>+ kesimpulan + alasan"]
```

### 8.1 Preprocessing Teks

Lowercase → hapus karakter non-alfanumerik → tokenisasi → stopword removal (Bahasa Indonesia) → stemming (PySastrawi).

### 8.2 TF-IDF

$$TF(t,d) = \frac{f_{t,d}}{\sum_{t'} f_{t',d}} \qquad IDF(t) = \log\frac{N}{df(t)} + 1 \qquad TF\text{-}IDF(t,d) = TF(t,d) \times IDF(t)$$

### 8.3 Cosine Similarity

$$sim(A,B) = \frac{A \cdot B}{\lVert A \rVert \times \lVert B \rVert} \in [0,1]$$

Digunakan untuk mencari produk kompetitor paling mirip (ditampilkan sebagai `kemiripan_persen`).

### 8.4 Fitur Model (1.019 Dimensi Bebas Leakage)

| Kelompok Fitur | Kolom Sumber | Transformasi / Dimensi | Peran |
|---|---|---|---|
| **Fitur Teks** | `nama_produk_clean` | TF-IDF Vectorizer (1.000 fitur, unigram & bigram) | Menangkap kata kunci komoditas unggulan |
| **Kategorikal** | `kategori`, `sub_kategori` | One-Hot Encoding (14 fitur) | Segmentasi sektor industri produk |
| **Harga Relatif** | `rasio_harga` | min(harga / median_kategori, 50.0) | Posisi relatif terhadap pasar |
| **Harga Deviasi** | `zscore_harga` | clip((harga - mean) / std, -5.0, 5.0) | Deteksi abnormalitas deviasi harga |
| **Skala Harga** | `log_harga` | ln(1 + harga) | Normalisasi varians sebaran harga |
| **Tier Harga** | `segmen_harga` | 0 (Murah) / 1 (Menengah) / 2 (Mahal) | Segmentasi daya beli konsumen |
| **Ulasan** | `rating` | Skala 1.0 – 5.0 (proxy kompetitor serupa) | Indikator kepuasan pelanggan |

> 📌 *Catatan Metodologi:* Fitur volume penjualan masa lalu (`jumlah_log`, `revenue_proxy_log`, `popularity_score_new`) telah dikeluarkan 100% dari input model untuk mencegah kebocoran informasi (*target leakage*).

### 8.5 Random Forest Classifier (v4)

Model menggunakan ensemble **200 pohon keputusan** dengan pembobotan kelas seimbang:
- **Konfigurasi:** `n_estimators=200`, `class_weight='balanced'`, `random_state=42`, `criterion='gini'`.
- **Hasil Evaluasi (Holdout Test 206 Data):**
  - Akurasi: **67.48%**
  - Precision: **68.00%**
  - Recall: **66.02%**
  - F1-Score: **66.99%**
  - ROC-AUC: **0.7242**
  - 5-Fold Stratified Cross Validation: **62.73%** ($\pm 3.12\%$).

### 8.6 Analisis Posisi Harga

| Rasio harga vs median pasar | Segmen |
|---|---|
| < 0.7× | Murah (selisih < −50% → "Sangat Murah") |
| 0.7× – 1.3× | Menengah |
| > 1.3× | Mahal (Premium) |

### 8.7 Interpretasi Hasil Prediksi

| Peluang Laku | Kesimpulan Flask v4 | Status UI |
|---|---|---|
| ≥ 70.0% | 🌟 Sangat Menarik | Peluang Tinggi |
| 50.0% – 69.9% | ✅ Cukup Menarik | Peluang Sedang |
| < 50.0% | ⚠️ Kurang Menarik | Peluang Rendah / Butuh Evaluasi Harga |

`predictionLabel` = 1 jika peluang ≥ 50.0%, selain itu 0.

> Contoh perhitungan manual lengkap tersedia di [docs/07-algoritma-prediksi.md](docs/07-algoritma-prediksi.md).

### 8.8 Algoritma Skor Rekomendasi Bisnis (Rule-Based)

Dihitung di [`server/api/recommendations/analyze.post.ts`](server/api/recommendations/analyze.post.ts) dari data kompetitor (hasil Flask, fallback ke query database).

| Dimensi | Kondisi | Status | Poin |
|---|---|---|---|
| **Harga** (selisih vs rata-rata kompetitor) | −20% s/d +25% | ok | +15 |
| | < −20% (terlalu murah) | warning | +5 |
| | > +25% (terlalu mahal) | danger | 0 |
| **Rating** (rata-rata kompetitor) | ≥ 4.0 | ok | +20 |
| | < 4.0 atau tanpa data | warning | +5 |
| **Kompetisi** (jumlah kompetitor) | ≤ 10 | ok | +15 |
| | 11 – 30 | warning | +7 |
| | > 30 | danger | 0 |

**Skor = 50 + poin harga + poin rating + poin kompetisi** (maks. 100).

| Skor | Label |
|---|---|
| ≥ 75 | Peluang Tinggi |
| 55 – 74 | Peluang Moderat |
| < 55 | Perlu Persiapan Lebih |

Output tambahan: daftar aksi per strategi, **KPI** (target penjualan = maks(50, 30% rata-rata terjual kompetitor) unit/bulan, target rating, response rate > 90%, return rate < 5%), top seller, dan 10 produk serupa.

---

## 9. Fitur & Halaman Aplikasi

### 9.1 Landing Page — `/` ([index.vue](app/pages/index.vue))

| Section | Isi |
|---|---|
| Navbar | Brand, link Fitur / Cara Kerja / Cara Kerja AI, tombol masuk |
| Hero | Judul, deskripsi, mockup hasil prediksi |
| Stats Bar | 1.027+ data produk, 3 marketplace, akurasi model, 6 kota/kabupaten |
| Fitur | 6 kartu: Prediksi Daya Tarik, Analisis Posisi Harga, Produk Paling Digemari, Insight Pasar, Segmen per Lokasi, Analisis Kompetitor |
| Cara Kerja | 3 langkah: Input → Proses → Hasil |
| Cara Kerja AI | Tab interaktif: TF-IDF & Cosine (dengan demo tokenisasi), Random Forest, Analisis Harga, Skor Akhir |
| CTA & Footer | Ajakan mencoba aplikasi |
| Auth Modal | Form Login & Register |

### 9.2 Dashboard — `/dashboard` ([dashboard.vue](app/pages/dashboard.vue)) 🔒

| Section | Isi | Sumber Data |
|---|---|---|
| Kartu Statistik | Total produk, rata-rata harga, rata-rata rating, total terjual | `stats` |
| CTA Prediksi | Pintasan ke halaman prediksi | – |
| Top 10 Produk Terlaris | Bar chart | `charts.topProducts` |
| Distribusi Kategori | Pie chart | `charts.categories` |
| Produk Rating Tertinggi | Bar chart | `charts.topRated` |
| Distribusi Harga | Line chart (0–50k, 50–100k, 100–200k, 200k+) | `charts.priceDistribution` |
| Distribusi Marketplace | Doughnut + progress bar | `marketplaceDistribution` |
| Top 15 Keyword Produk | Horizontal bar (frekuensi kata nama produk) | `topKeywords` |
| Kategori Paling Digemari | Ranking kategori berdasarkan total unit terjual | `categoryTrend` |
| Produk Teratas per Lokasi | Filter Semua/Bogor/Jakarta/Bekasi/Depok/Tangerang/Lainnya | `topProductsByLocation` |
| Produk Terlaris per Platform | Filter Tokopedia/Shopee/Lazada | `topProductsByMarketplace` |

### 9.3 Prediksi Tren — `/prediksi` ([prediksi.vue](app/pages/prediksi.vue)) 🔒

| Section | Isi |
|---|---|
| Form Input | Nama produk, kategori, sub-kategori, harga |
| Riwayat | 5 prediksi terakhir (disimpan di `localStorage`), bisa diulang / dihapus |
| Produk Terpopuler | Top produk di kategori terpilih |
| Score Banner | Peluang laku (%) + progress bar + kesimpulan + badge segmen harga |
| Konteks Harga | Median pasar, rasio, segmen, selisih (%) |
| Analisis (Alasan) | Narasi alasan hasil prediksi |
| Insight Pasar | Ranking kategori, posisi kategori pengguna, sub-kategori terpopuler |
| Kompetitor Serupa | Tabel produk mirip + % kemiripan + link ke marketplace |
| State UI | Empty, loading skeleton, error, notifikasi *cold start* server |

Hasil prediksi dapat diteruskan ke halaman Rekomendasi (via `sessionStorage`).

### 9.4 Rekomendasi Bisnis — `/rekomendasi` ([rekomendasi.vue](app/pages/rekomendasi.vue)) 🔒

| Section | Isi |
|---|---|
| Form Input | Sama dengan prediksi; terisi otomatis jika datang dari halaman prediksi |
| Score Banner | Skor peluang (0–100) + label |
| Perbandingan Pasar | Rata-rata harga, rating, terjual kompetitor + rentang harga |
| Kartu Strategi | Harga, Kualitas & Rating, Kompetisi, Marketing (status Baik/Perhatian/Risiko + daftar aksi) |
| Target KPI | Target penjualan, rating, response rate, return rate |
| Top Seller | Produk kompetitor terlaris |
| Tabel Produk Serupa | 10 produk kompetitor |

### 9.5 Autentikasi & Layout

- Register / Login dengan email + password (hash bcrypt, salt round 10).
- Session cookie berlaku **7 hari**.
- Middleware [`auth.ts`](app/middleware/auth.ts) melindungi halaman 🔒; pengguna belum login diarahkan ke `/`.
- Layout [`default.vue`](app/layouts/default.vue): sidebar (mode rail tersimpan di `localStorage`), topbar, tombol logout.

---

## 10. Alur Kerja Sistem

### 10.1 Autentikasi

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant W as Nuxt Server
    participant D as PostgreSQL
    U->>W: POST /api/auth/register (nama, email, password)
    W->>D: Cek email, simpan user (password di-hash bcrypt)
    U->>W: POST /api/auth/login (email, password)
    W->>D: Cari user, bcrypt.compare
    W-->>U: Set session cookie (7 hari)
```

### 10.2 Prediksi Tren

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant W as Nuxt Server
    participant F as Flask ML API
    U->>W: POST /api/predict
    W->>W: Cek session + validasi input
    W->>F: POST /predict (coba localhost:5000, lalu URL production)
    F->>F: Validasi kategori, TF-IDF, cosine, Random Forest
    F-->>W: peluang_laku_persen, kesimpulan, alasan, kompetitor, insight
    W-->>U: Data hasil yang sudah dipetakan
    U->>U: Simpan riwayat di localStorage
```

### 10.3 Rekomendasi Bisnis

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant W as Nuxt Server
    participant F as Flask ML API
    participant D as PostgreSQL
    U->>W: POST /api/recommendations/analyze
    W->>W: Validasi keyword nama vs kategori
    W->>F: POST /predict (ambil kompetitor)
    alt Flask gagal / kompetitor kosong
        W->>D: Query produk kategori sama (top 50 by terjual)
    end
    W->>W: Hitung metrik pasar, status 3 dimensi, skor, KPI
    W-->>U: Skor, strategi, KPI, top seller, produk serupa
```

### 10.4 Dashboard

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant W as Nuxt Server
    participant D as PostgreSQL
    U->>W: GET /api/dashboard/stats
    alt Cache < 5 menit
        W->>W: Pakai cache in-memory
    else
        W->>D: SELECT * FROM products (pg.Pool)
    end
    W->>W: Agregasi (stats, distribusi, top produk, keyword)
    W-->>U: JSON siap pakai Chart.js
```

---

## 11. API Endpoint

### Nuxt Server API

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | `/api/auth/register` | – | Registrasi akun |
| POST | `/api/auth/login` | – | Login & set session |
| POST | `/api/auth/logout` | ✔ | Hapus session |
| GET | `/api/dashboard/stats` | – | Statistik & data grafik dashboard |
| POST | `/api/predict` | ✔ | Prediksi peluang laku (proxy ke Flask) |
| POST | `/api/recommendations/analyze` | ✔ | Analisis & skor rekomendasi bisnis |
| GET | `/api/flask-health` | – | Cek status Flask API |
| POST | `/api/predictions/save` | ✔ | *(belum dipakai frontend — lihat §17)* |
| POST | `/api/recommendations/save` | ✔ | *(belum dipakai frontend — lihat §17)* |

**Contoh request `/api/predict` & `/api/recommendations/analyze`:**

```json
{
  "namaProduk": "Lapis Talas Sentul",
  "kategori": "Makanan",
  "subKategori": "Kue & Roti",
  "hargaProduk": 45000
}
```

**Kode error penting:**

| Kode | Penyebab |
|---|---|
| 400 | Data input tidak lengkap |
| 401 | Belum login / kredensial salah |
| 422 | Kategori tidak sesuai nama produk (validasi keyword) atau peringatan dari Flask |
| 503 | Flask API tidak dapat dihubungi (mis. *cold start* Render) |

### Flask ML API

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/predict` | Prediksi + kompetitor + konteks harga + insight pasar |
| GET | `/health` | Status server & model |

Detail format response: [docs/04-machine-learning.md](docs/04-machine-learning.md).

---

## 12. Desain Database

Skema: [`prisma/schema.prisma`](prisma/schema.prisma)

```mermaid
erDiagram
    users ||--o{ predictions : memiliki
    users {
        string id PK
        string email UK
        string password
        string name
        datetime createdAt
        datetime updatedAt
    }
    predictions {
        string id PK
        string userId FK
        string namaProduk
        string kategori
        string subKategori
        int hargaProduk
        float predictionScore
        int predictionLabel
        text insight
        datetime createdAt
    }
    products {
        string id PK
        string url
        string namaProduk
        string kategori
        string subKategori
        string marketplace
        string lokasi
        string namaToko
        int hargaProduk
        int jumlahTerjual
        float rating
        float popularityScore
        int hargaTier
        datetime createdAt
    }
```

| Tabel | Fungsi |
|---|---|
| `users` | Akun pengguna |
| `predictions` | Riwayat prediksi per user (relasi cascade delete) |
| `products` | 1.027 data produk hasil preprocessing (referensi dashboard & fallback kompetitor) |

**Riwayat migrasi:** `20260225071030_init` → `20260713130433_remove_product_tables` → `20260718062925_add_product_table`.

---

## 13. Deployment

| Layanan | Platform | URL |
|---|---|---|
| Web App (Nuxt) | Vercel (Serverless Functions) | [radar-umkm.vercel.app](https://radar-umkm.vercel.app) |
| ML API (Flask) | Render (free tier) | [radarumkmbogor-api.onrender.com](https://radarumkmbogor-api.onrender.com) |
| Health Check | Render | [/health](https://radarumkmbogor-api.onrender.com/health) |
| Database | Supabase (PostgreSQL) | via `DATABASE_URL` |

**Environment Variables:**

| Variable | Fungsi |
|---|---|
| `DATABASE_URL` | Koneksi PostgreSQL via pooler (port 6543) |
| `DIRECT_URL` | Koneksi direct untuk migrasi/seeding (port 5432) |
| `NUXT_SESSION_PASSWORD` | Kunci enkripsi session (≥ 32 karakter) |
| `FLASK_API_URL` | URL Flask ML API |

Panduan lengkap: [docs/06-deployment.md](docs/06-deployment.md).

---

## 14. Cara Menjalankan (Lokal)

**Prasyarat:** Node.js ≥ 20.19.0, PostgreSQL (lokal atau Supabase).

```bash
# 1. Clone & install
git clone https://github.com/AogamiKiryuu/RadarUMKM.git
cd prediksi-tren-pasar
npm install
```

```env
# 2. Buat file .env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
NUXT_SESSION_PASSWORD="ganti-dengan-string-acak-minimal-32-karakter"
FLASK_API_URL="https://radarumkmbogor-api.onrender.com"
```

```bash
# 3. Migrasi & seeding
npx prisma migrate deploy
npm run import:products

# 4. Jalankan
npm run dev        # atau start.bat / start.ps1 di Windows
```

Buka [http://localhost:3000](http://localhost:3000).

| Script | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + build production |
| `npm run prisma:migrate` | Buat migrasi baru |
| `npm run prisma:studio` | GUI database |
| `npm run import:products` | Import CSV ke tabel `products` |

---

## 15. Struktur Proyek

```
prediksi-tren-pasar/
├── app/
│   ├── pages/
│   │   ├── index.vue            # Landing page + modal login/register
│   │   ├── dashboard.vue        # Dashboard analitik
│   │   ├── prediksi.vue         # Prediksi tren
│   │   └── rekomendasi.vue      # Rekomendasi bisnis
│   ├── layouts/default.vue      # Sidebar + topbar
│   ├── middleware/auth.ts       # Route guard
│   └── generated/prisma/        # Prisma client (generated)
├── server/
│   ├── api/
│   │   ├── auth/                # login, register, logout
│   │   ├── dashboard/stats.get.ts
│   │   ├── predict.post.ts
│   │   ├── recommendations/     # analyze, save
│   │   ├── predictions/save.post.ts
│   │   └── flask-health.get.ts
│   ├── plugins/                 # DNS ipv4first, migrate (nonaktif)
│   └── utils/                   # prisma.ts, csv-dataset.ts (agregasi dashboard)
├── prisma/                      # schema.prisma, migrations/, seed.ts
├── scripts/                     # import-products.js, migrate.js
├── data/
│   ├── raw/                     # Data mentah scraping
│   └── processed/               # Data hasil preprocessing
├── docs/                        # Dokumentasi teknis + diagram
└── nuxt.config.ts
```

---

## 16. Skenario Pengujian (Black-Box)

Template pengujian berdasarkan perilaku sistem. Kolom **Hasil** diisi saat pengujian.

| No | Fitur | Skenario | Hasil yang Diharapkan | Hasil |
|---|---|---|---|---|
| 1 | Register | Isi semua field valid | Akun dibuat, muncul notifikasi sukses | |
| 2 | Register | Email sudah terdaftar | Error "Email sudah terdaftar" | |
| 3 | Register | Ada field kosong | Error "Email, password, dan nama harus diisi" | |
| 4 | Login | Kredensial benar | Masuk ke dashboard | |
| 5 | Login | Password salah | Error "Email atau password salah" | |
| 6 | Akses | Buka `/dashboard` tanpa login | Diarahkan ke `/` | |
| 7 | Dashboard | Buka halaman | Kartu statistik & semua grafik tampil | |
| 8 | Dashboard | Ganti filter lokasi / marketplace | Daftar produk berubah sesuai filter | |
| 9 | Prediksi | Input valid (mis. "Lapis Talas", Makanan, 45000) | Tampil peluang laku, kesimpulan, kompetitor | |
| 10 | Prediksi | Nama "Kopi Bubuk" dengan kategori Makanan | Error 422: kategori tidak sesuai | |
| 11 | Prediksi | Harga kosong | Error data tidak lengkap | |
| 12 | Prediksi | Flask API sedang tidur | Notifikasi "Server sedang dinyalakan" / 503 | |
| 13 | Prediksi | Klik item riwayat | Form terisi & prediksi diulang | |
| 14 | Rekomendasi | Input valid | Tampil skor, 4 strategi, KPI, produk serupa | |
| 15 | Rekomendasi | Lanjut dari halaman prediksi | Form terisi otomatis & analisis berjalan | |
| 16 | Logout | Klik logout | Session dihapus, kembali ke landing | |

---

## 17. Keterbatasan & Catatan Teknis

**Keterbatasan sistem:**

- Data merupakan snapshot scraping, tidak diperbarui otomatis.
- Distribusi data tidak seimbang (mis. Aksesoris & Souvenir hanya 25 produk, Teh hanya 5).
- Flask di Render free tier mengalami *cold start* 30–60 detik setelah idle 15 menit.
- Validasi kategori berbasis kamus keyword, sehingga produk di luar kamus tidak tervalidasi.
- Skor rekomendasi bersifat rule-based (bukan model ML).

**Catatan teknis (perlu dirapikan):**

- Riwayat prediksi masih disimpan di `localStorage`, belum di tabel `predictions`.
- `server/api/predictions/save.post.ts` memakai field `targetRating` yang tidak ada di skema.
- `server/api/recommendations/save.post.ts` memakai model `businessRecommendation` yang sudah dihapus dari skema.
- `server/api/debug-env.get.ts` sebaiknya dihapus di production.
- Beberapa dokumen di `docs/` masih mencantumkan 7 kategori, padahal aplikasi saat ini mendukung 4 kategori.
- Ambang kesimpulan di tab "Skor Akhir" landing page (70/40) berbeda dengan dokumentasi ML (75/50/25). Samakan dengan nilai di Flask.
- Angka "Akurasi Model 92%" di landing page perlu dicocokkan dengan hasil evaluasi di repo Flask (confusion matrix, precision, recall, F1).

---

## 18. Pengembangan Selanjutnya

- Scraping terjadwal agar data selalu terbaru.
- Menyimpan riwayat prediksi & rekomendasi ke database per user.
- Menambah kategori produk (Kerajinan, Pertanian, Kesehatan & Kecantikan).
- Menyeimbangkan data (oversampling/SMOTE) dan membandingkan model lain (XGBoost, LightGBM).
- Ekspor hasil prediksi/rekomendasi ke PDF.
- Analisis tren berbasis waktu (time series) jika tersedia data historis.

---

## 19. Panduan Pemetaan ke Laporan

| Bab Laporan | Ambil dari Section README |
|---|---|
| BAB I — Pendahuluan | §2 Latar Belakang & Rumusan Masalah, §3 Tujuan & Manfaat, §4 Ruang Lingkup |
| BAB II — Landasan Teori | §8 Metodologi (TF-IDF, Cosine Similarity, Random Forest, Gini), §5 Teknologi |
| BAB III — Metodologi / Analisis & Perancangan | §6 Arsitektur, §7 Dataset & Preprocessing, §10 Alur Kerja, §12 Desain Database, §11 API |
| BAB IV — Implementasi & Pengujian | §9 Fitur & Halaman (+ screenshot), §8.8 Skor Rekomendasi, §13 Deployment, §16 Pengujian |
| BAB V — Penutup | §17 Keterbatasan, §18 Pengembangan Selanjutnya |
| Lampiran | §14 Cara Menjalankan, §15 Struktur Proyek, contoh request/response API |

> [!TIP]
> Untuk BAB IV, ambil screenshot tiap section di §9 (Landing, Dashboard, Prediksi, Rekomendasi) dan beri caption sesuai nama section di tabel.

---

## 20. Dokumentasi Lanjutan

| Dokumen | Isi |
|---|---|
| [01-overview.md](docs/01-overview.md) | Gambaran umum & arsitektur |
| [02-web-frontend.md](docs/02-web-frontend.md) | Frontend Nuxt / Vue |
| [03-web-backend.md](docs/03-web-backend.md) | Server API Nitro |
| [04-machine-learning.md](docs/04-machine-learning.md) | Model ML & Flask API |
| [05-database.md](docs/05-database.md) | Database Supabase / PostgreSQL |
| [06-deployment.md](docs/06-deployment.md) | Deployment Vercel & Render |
| [07-algoritma-prediksi.md](docs/07-algoritma-prediksi.md) | Perhitungan matematis & contoh manual |
| [diagrams/](docs/diagrams/) | Diagram arsitektur & ERD (Mermaid) |

---

## Lisensi

Repositori ini dibuat untuk keperluan akademik program MBKM.