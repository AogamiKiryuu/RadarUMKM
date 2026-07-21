# 04 — Machine Learning & Flask API

## Gambaran Umum

Model ML dijalankan sebagai layanan terpisah menggunakan **Python Flask**, di-deploy ke **Render**. Nuxt Server memanggil Flask via HTTP setiap kali ada request prediksi.

**URL Production:** `https://radarumkmbogor-api.onrender.com`

---

## Stack ML

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Web framework | Flask | >= 2.x |
| ML library | scikit-learn | >= 1.x |
| Data processing | pandas, numpy | - |
| NLP (stemming) | PySastrawi | - |
| Model format | joblib | - |

---

## Dataset

**File:** `data/processed/dataset_preprocessed.csv`

**Ukuran:** 1.027 baris produk UMKM Bogor

**Sumber:** Hasil scraping marketplace (Tokopedia, Shopee, Lazada)

**Kolom penting:**

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `nama_produk` | string | Nama produk asli |
| `nama_produk_clean` | string | Nama produk setelah cleaning |
| `kategori` | string | Makanan, Minuman, Pakaian & Fashion, dll |
| `sub_kategori` | string | Spesifikasi kategori |
| `marketplace` | string | tokopedia / shopee / lazada |
| `lokasi` | string | Kota penjual |
| `harga_produk` | int | Harga dalam Rupiah |
| `jumlah_terjual` | int | Total item terjual |
| `rating` | float | Rating 1.0–5.0 |
| `popularity_score` | float | Skor popularitas gabungan |
| `label` | int | 0 (tidak menarik) / 1 (menarik) — target ML |

**Label (`label`)** ditentukan berdasarkan kombinasi:
- `jumlah_terjual` di atas median kategori, **DAN**
- `rating` ≥ 4.0, **DAN**
- `popularity_score` di atas persentil ke-60

---

## Model Machine Learning

### Algoritma

Model yang digunakan: **Random Forest Classifier** (dan/atau Gradient Boosting — sesuai versi terbaru)

**File model:** `model_umkm_bogor.joblib` (di repo Flask API)

### Fitur Input Model

Model dilatih dengan fitur-fitur berikut:

| Fitur | Tipe | Preprocessing |
|-------|------|---------------|
| `harga_produk` | float | Log transform + StandardScaler |
| `kategori` | categorical | Label encoding |
| `sub_kategori` | categorical | Label encoding |
| `harga_log_scaled` | float | Log(harga) / StandardScaler |
| `harga_tier` | int | Binning: 0=murah, 1=menengah, 2=mahal |
| `kompetitor_count` | int | Jumlah produk serupa di dataset |
| `median_harga_kategori` | float | Median harga dalam kategori |
| `rasio_harga_vs_median` | float | harga / median_kategori |

### Preprocessing Teks

Nama produk diproses melalui:
1. **Lowercase** + hapus karakter non-alfanumerik
2. **Tokenisasi** (split by spasi)
3. **Stopword removal** (Bahasa Indonesia)
4. **Stemming** via PySastrawi (Sastrawi stemmer)

---

## Flask API Endpoints

### `POST /predict`

**Deskripsi:** Endpoint utama prediksi.

**Request Body:**
```json
{
  "nama_produk": "Lapis Talas Sentul",
  "kategori": "Makanan",
  "sub_kategori": "Kue & Roti",
  "harga_produk": 45000
}
```

**Proses Internal Flask:**

```
1. Validasi input (nama produk, kategori, harga)
2. Cek kategori konsisten dengan nama produk
   (via PRODUK_KATEGORI_MAP — peta keyword → kategori)
3. Cari kompetitor dari dataset:
   - Filter by kategori sama
   - Hitung kemiripan nama (keyword overlap)
   - Ambil top 10 kompetitor by popularity_score
4. Hitung konteks harga:
   - median_pasar = median harga kompetitor
   - rasio_vs_pasar = harga_user / median_pasar
   - segmen:
     * < 0.7x median → "Murah"
     * 0.7x - 1.3x median → "Menengah"
     * > 1.3x median → "Premium"
   - selisih_persen = (harga - median) / median * 100
5. Buat fitur vektor untuk model
6. model.predict_proba() → probability class 1
7. peluang_laku_persen = probability * 100
8. Tentukan kesimpulan:
   * >= 75% → "Sangat Menarik"
   * >= 50% → "Cukup Menarik"
   * >= 25% → "Kurang Menarik"
   * < 25%  → "Tidak Menarik"
9. Generate alasan (narasi berbasis rules + fitur)
10. Ambil produk terpopuler di kategori
11. Hitung insight pasar (ranking kategori, dll)
```

**Response:**
```json
{
  "status": "success",
  "kesimpulan": "Cukup Menarik",
  "peluang_laku_persen": 62.5,
  "alasan": [
    "Produk serupa sudah banyak dijual (6 kompetitor ditemukan).",
    "Harga produk Anda (Rp 45.000) mendekati median pasar (Rp 38.000).",
    "Kategori Makanan memiliki permintaan yang stabil di Bogor."
  ],
  "konteks_harga": {
    "median_pasar": 38000,
    "rasio_vs_pasar": 1.18,
    "segmen": "Menengah",
    "selisih_persen": 18.4
  },
  "kompetitor": [
    {
      "nama": "Lapis Talas Bogor Original",
      "harga": 35000,
      "rating": 4.8,
      "terjual": 1250,
      "marketplace": "Tokopedia",
      "url_produk": "https://...",
      "kemiripan_persen": 85.0
    }
  ],
  "produk_terpopuler": {
    "label": "Produk Terlaris di Kategori Ini",
    "deskripsi": "Top 5 produk Makanan dengan penjualan tertinggi",
    "produk": [...]
  },
  "insight_pasar": {
    "narasi": "Makanan adalah kategori paling kompetitif di Bogor...",
    "kategori_terpopuler": "Makanan",
    "sub_kategori_terpopuler": "Keripik & Snack",
    "posisi_kategori_anda": 1,
    "total_kategori": 8,
    "ranking_semua_kategori": [...],
    "top5_sub_kategori_global": [...],
    "sub_kategori_dalam_kategori_ini": [...]
  }
}
```

### `GET /health`

Cek status Flask API.

**Response:**
```json
{ "status": "ok", "model": "loaded", "version": "3.0" }
```

---

## Validasi Kategori (PRODUK_KATEGORI_MAP)

Flask memiliki peta keyword → kategori untuk memvalidasi apakah kategori yang dipilih user konsisten dengan nama produk.

**Contoh mapping:**
```python
PRODUK_KATEGORI_MAP = {
  'lapis talas'     : 'Makanan',
  'talas bogor'     : 'Makanan',
  'roti unyil'      : 'Makanan',
  'kopi'            : 'Minuman',
  'batik'           : 'Pakaian & Fashion',
  'gantungan kunci' : 'Aksesoris & Souvenir',
  ...
}
```

Jika keyword dalam nama produk cocok dengan kategori **berbeda** dari yang dipilih user → Flask mengembalikan `status: "warning"` dengan saran kategori yang benar.

**Peta ini direplikasi juga di `server/api/recommendations/analyze.post.ts`** agar validasi konsisten antara Flask dan Nuxt server.

---

## Kategori & Sub-Kategori yang Didukung

| Kategori | Sub-Kategori |
|----------|-------------|
| Makanan | Kue & Roti, Keripik & Snack, Olahan Daging, Bumbu & Rempah, Buah & Sayur, Lainnya |
| Minuman | Kopi, Teh, Susu & Dairy, Minuman Herbal, Jus & Minuman Segar, Lainnya |
| Pakaian & Fashion | Batik & Tenun, Kaos & Kemeja, Aksesoris Fashion, Lainnya |
| Kerajinan Tangan | Anyaman & Rotan, Kayu & Ukiran, Lainnya |
| Aksesoris & Souvenir | Souvenir Khas Bogor, Aksesoris Rumah, Lainnya |
| Pertanian & Perkebunan | Sayuran Segar, Buah-buahan, Tanaman Hias, Hasil Kebun Olahan, Lainnya |
| Kesehatan & Kecantikan | Produk Herbal, Kosmetik & Perawatan, Lainnya |

---

## Deployment Flask di Render

**Platform:** Render (Free tier — sleep setelah 15 menit tidak aktif)

**Implikasi cold start:**
- Request pertama setelah idle bisa membutuhkan **30-60 detik** (Render wake up)
- Nuxt server menggunakan `timeout: 30000` (30 detik) saat memanggil Flask
- Jika timeout → user mendapat error 503 dengan pesan yang informatif

**Cara cek status Flask:**
```
GET https://radarumkmbogor-api.onrender.com/health
```
