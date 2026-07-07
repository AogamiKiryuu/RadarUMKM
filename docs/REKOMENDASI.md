# Dokumentasi Fitur: Rekomendasi & Strategi Bisnis (RadarUMKM)

## Deskripsi Singkat
Fitur **Rekomendasi** dititikberatkan tidak hanya melihat persentase laku (seperti Prediksi), melainkan berfungsi sebagai **konsultan strategi digital instan**. Fitur ini mengambil "potret pasar" dari produk yang disasar oleh pengguna dan mengembalikan instruksi *Act-Now* (Siap Dijalankan) terkait strategi penetapan harga, strategi menjaga kualitas, pedoman bersaing, hingga target KPI bulanan.

## Arsitektur Sistem & Integrasi ML
Terletak utamanya pada router `server/api/recommendations/analyze.post.ts`. Arsitektur fitur  ini adalah **Hybrid ML-Database**:

1. **Pencarian Kompetitor Cerdas (ML - Cosine Similarity via Flask)**: 
   Endpoint `analyze` tidak lagi mencari berdasarkan kategori kaku. Endpoint ini akan menembak ke API Flask (`/predict`) terlebih dahulu untuk mencari kompetitor yang benar-benar mirip secara *Natural Language* menggunakan **TF-IDF & Cosine Similarity**. 
   Hal ini menjamin apabila Anda meng-input "Keripik Singkong Balado", sistem tidak akan disesatkan oleh keripik pisang, melainkan fokus pada kemiripan kata. 
   *(Catatan: Error / Warning validasi pintar dari Flask mengenai kategori yang tidak cocok akan diteruskan langsung ke pengguna sebagai format HTTP 422).*

2. **Automated Fallback (Database Prisma)**:
   Sistem disusun *Resilient* (tahan banting). Apabila API Flask ML sedang *down* (mati) atau tidak menemukan produk dengan batas metrik Cosine > 0.05, maka ia secara otomatis akan jatuh kembali (fallback) memanggil *database relasional* menggunakan **Prisma ORM**. Pencariannya kemudian didasarkan murni pada filter exact match kategori (misal: "Makanan") & subKategori, diekstrak 20 kompetitor teratas yang memilki jumlah terjual tertinggi.

## Algoritma Logika Bisnis (Business Engine)
Begitu *pool* (kumpulan top kompetitor) ditentukan dari tahap di atas, sistem Nuxt akan menghitung strategi bisnis dengan metrik murni (TypeScript):

### 1. Price Strategy (Strategi Harga)
- Menghitung **Average Harga** (`avgHarga`) dari kompetitor yang ada.
- Membandingkan `hargaProduk` pengguna dengan agregat `avgHarga`.
- Jika selisih > 25% lebih mahal: Indikator status menjadi `danger`. Pengguna disarankan memperkuat "Brand Value", atau menurunkan harga ke rata-rata dikali 1.05.
- Jika selisih < -20% lebih murah: Indikator status menjadi `warning` (perlu memastikan margin positif / tidak perang harga).
- Lainnya: Status `ok` (kompetitif).

### 2. Rating Analysis (Strategi Kualitas)
- Menghitung **Average Rating** (`avgRating`) dari kompetitor.
- Merekomendasikan perlunya pengejaran skor minimum berdasarkan performa pemimpin pasar di ceruk produk tersebut (karena e-commerce sangat bergantung pada *trust rate*).

### 3. Competition Analysis (Analisa Kompetisi)
- Mengkalkulasikan kedalaman pasar (*market depth*) berdasarkan total kompetitor. 
- Jika padat (> 30 produk relevan): Status `danger`, saran yang dikeluarkan berupa strategi spesialisasi produk (Niche targetting).
- Jika terbuka (< 10 produk): Status `ok`, peluang memonopoli sub-kategori sangat baik jika di-*push* pada fase awal penjualan (*first-mover advantage*).

### 4. Output Data & KPIs
Hasil rekomendasi yang disajikan pada antarmuka pengguna direpresentasikan ke dalam:
- Visual Opportunity Score (0 - 100)
- `strategies`: Array berisi *status* (ok/warning/danger), *headline*, dan kumpulan aksi (*actions*) spesifik.
- `kpis`: Rangkuman indikator keberhasilan bulanan, dihitung secara proporsional. Misal: target penjualan rasional = 30% dari rata-rata volume keseluruhan pasar (minimum 50 unit jaminan omzet).
- `topSeller`: Tampilan rujukan produk 1 terbaik (*Role Model*) di kelas tersebut.
