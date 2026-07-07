# Dokumentasi Fitur: Prediksi Peluang Usaha (RadarUMKM)

## Deskripsi Singkat
Fitur **Prediksi** digunakan untuk memprakirakan seberapa besar peluang laku suatu produk UMKM (khususnya untuk daerah Bogor) jika dijual di pasaran. Fitur ini dirancang berbasiskan Model *Machine Learning* untuk memberikan pandangan rasional yang didukung oleh data (data-driven) kepada pelaku UMKM sebelum memulai produksi massal atau menetapkan harga.

## Arsitektur Sistem
Fitur Prediksi berjalan menggunakan dua lapisan backend:
1. **Frontend / API Gateway (Nuxt 3)**: Terletak di `server/api/predict.post.ts`. Bertugas menerima *input* dari pengguna, melakukan validasi kelengkapan data dasar, kemudian meneruskannya ke backend analitik.
2. **Backend ML (Flask / Python)**: Menyediakan endpoint `/predict`. Bertugas menjalankan validasi kepintaran buatan (*Natural Language Processing*) dan perhitungan algoritme Machine Learning untuk menghasilkan skor peluang laku.

## Algoritma & Logika Pemrosesan

### 1. Validasi Input Pintar (NLP)
Sebelum model prediksi berjalan, input dari pengguna dianalisis menggunakan metode pencocokan kata (Keyword Matching & NLP):
- **Validasi Kategori**: Memeriksa apakah *Nama Produk* relevan dengan *Kategori* yang dipilih (Misal: Jika input "Susu Sapi", tetapi kategori "Pakaian", maka akan ditolak dengan HTTPException 400).
- **Validasi Khas Bogor**: Memeriksa konteks apakah produk tersebut rasional teridentifikasi sebagai produk UMKM yang wajar untuk dijual di area / konteks lokal pasar Bogor.

### 2. Pencarian Kompetitor (Cosine Similarity & TF-IDF)
Untuk mengidentifikasi produk apa saja di pasar yang paling mirip dengan produk yang akan diprediksi:
- Sistem tidak menggunakan pencarian database tradisional biasa.
- Sistem menggunakan algoritme **TF-IDF Vectorizer** untuk mengubah nama produk menjadi vektor numerik matematika.
- Kemudian menggunakan **Cosine Similarity** untuk menghitung kedekatan (kemiripan makna/teks) antara produk pengguna dengan ribuan produk pada *dataset* historis (seperti Shopee/Tokopedia).
- Diperoleh 5 kompetitor teratas dengan tingkat kemiripan tertinggi (dengan ambang batas minimal skor > 0.05). Output ini menyertakan nilai persentase `kemiripan_persen`.

### 3. Prediksi Peluang Laku 
Setelah kompetitor serupa ditemukan:
- Ekstraksi parameter bisnis seperti *Target Harga* (disandingkan dengan rata-rata harga pasar kompetitor serupa), *Rating*, dll.
- Model Machine Learning (seperti Random Forest) menggunakan parameter-parameter ini untuk men- *generate* probabilitas / peluang laku dalam bentuk persentase (0-100%).
- Jika skor >= 50%, produk dianggap "**Menarik / Berpeluang Laku**". Jika < 50%, produk "**Kurang Menarik / Risiko Tinggi**".

## Bentuk Output (Response API)
Hasil dari proses pemahaman ini dikembalikan ke web client dalam bentuk spesifikasi JSON berikut:
- `predictionScore` (number): Persentase taksiran keberhasilan pasar (0-100).
- `predictionLabel` (number): `1` (Berpeluang), `0` (Risiko).
- `kesimpulan` (string): Narasi otomatis tingkat laku (*Highly competitive*, *Struggle*, dsb).
- `alasan` (array of string): Poin-poin spesifik mengapa produk ini mendapatkan skor tersebut (Misal: "Harga terlalu mahal 50% dari rata-rata pesaing terdekat").
- `similarProducts` (array of objects): Daftar top kompetitor beserta tautan marketplace, nama toko, harga asli, & jumlah terjual sebagai preferensi pengguna.
