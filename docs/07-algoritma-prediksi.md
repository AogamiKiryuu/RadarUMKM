# 07 — Algoritma Prediksi (Random Forest)

## Gambaran Umum Model
RadarUMKMBogor menggunakan algoritma **Random Forest Classifier** untuk memprediksi apakah sebuah produk UMKM memiliki daya tarik pasar (Laku) atau tidak. Model ini dilatih menggunakan 1.027 data produk riil UMKM Bogor dari berbagai marketplace (Tokopedia, Shopee, Lazada).

---

## 1. Variabel Input (Fitur)
Berikut adalah daftar fitur yang digunakan oleh model saat memprediksi:
1. `harga_produk` (Numerik): Harga yang diinputkan pengguna.
2. `kategori` & `sub_kategori` (Kategorikal): Diubah menjadi nilai numerik melalui proses *Label Encoding*.
3. `kompetitor_count` (Numerik): Jumlah produk serupa di dalam dataset.
4. `median_harga_kategori` (Numerik): Nilai tengah harga dari produk-produk di kategori tersebut.
5. `rasio_harga_vs_median` (Numerik): Hasil pembagian `harga_produk` dengan `median_harga_kategori`.
6. `harga_tier` (Kategorikal): Segmentasi harga (0 = Murah, 1 = Menengah, 2 = Premium/Risiko).
7. `harga_log_scaled` (Numerik): Harga yang di-transformasi dengan algoritma *Logaritma Natural (ln)* kemudian distandarisasi (StandardScaler).

---

## 2. Definisi Label (Target Variabel)
Label (Y) yang dilatih oleh model bernilai `0` (Tidak Menarik) atau `1` (Menarik).
Kondisi suatu produk dianggap bernilai `1` pada saat *training* adalah jika memenuhi ketiga kriteria ini:
- **Jumlah Terjual** > Median jumlah terjual di kategorinya
- **Rating** >= 4.0
- **Popularity Score** > Persentil ke-60 dari seluruh data

---

## 3. Cara Kerja Random Forest
Random Forest adalah sekumpulan *Decision Tree* (Pohon Keputusan). Model ini bekerja dengan cara:
1. Membangun banyak Decision Tree (misal: 100 pohon).
2. Masing-masing pohon akan memprediksi peluang laku (0 atau 1) dari fitur yang masuk.
3. Hasil akhir (probabilitas laku) dihitung menggunakan **Majority Voting** atau rata-rata probabilitas dari seluruh pohon.

### Rumus Probabilitas Kelas (Peluang Laku)
Jika kita memiliki $M$ buah Decision Tree, dan prediksi pohon ke-$m$ dilambangkan dengan $P_m(Y=1 | x)$, maka peluang prediksi keseluruhan dari Random Forest adalah:

$$ P(Y=1 | X) = \frac{1}{M} \sum_{m=1}^{M} P_m(Y=1 | X) $$

**Keterangan:**
- $X$ = Vektor fitur input pengguna.
- $M$ = Jumlah total decision tree di dalam hutan (forest).
- $P(Y=1 | X)$ = Probabilitas final produk tergolong menarik (laku).

Nilai peluang ini yang ditampilkan di UI (misal: 72%).

### Rumus Gini Impurity (Pembentukan Decision Tree)
Setiap percabangan dalam *Decision Tree* menggunakan nilai *Gini Impurity* untuk mencari pemisahan (*split*) data yang paling menguntungkan (mampu memisahkan label 0 dan 1 dengan paling bersih).

$$ Gini = 1 - \sum_{i=1}^{C} (p_i)^2 $$

Di mana:
- $C$ = Jumlah kelas (dalam hal ini 2, yaitu 0 dan 1)
- $p_i$ = Probabilitas kemunculan kelas ke-$i$ di dalam cabang tertentu.

---

## 4. Perhitungan Manual & Validasi (Contoh Simulasi)
Sebagai contoh, pengguna menginput:
- **Nama Produk**: Lapis Talas Sentul
- **Kategori**: Makanan
- **Harga**: Rp 45.000

### Langkah 1: Kalkulasi Fitur Turunan (Di Server / Flask)
1. Kategori "Makanan" memiliki `median_harga_kategori` misalnya **Rp 38.000**.
2. Berdasarkan input nama, sistem mendeteksi ada **12** produk serupa di database (`kompetitor_count` = 12).
3. **Rasio Harga vs Median**: 
   $$ Rasio = \frac{45000}{38000} = 1.18 $$
4. Karena rasio (1.18) berada di antara 0.7 dan 1.3, maka segmentasi `harga_tier` ditetapkan sebagai **Menengah (1)**.

### Langkah 2: Proses Prediksi oleh Random Forest
Vektor fitur (kategori=Makanan, rasio=1.18, kompetitor=12, dsb) dilempar ke dalam model Random Forest yang misal terdiri dari 5 Decision Tree untuk penyederhanaan:
- **Pohon 1**: Prediksi $Y=1$ (Peluang 0.8) karena harga cukup wajar dan kompetitor banyak (demand tinggi).
- **Pohon 2**: Prediksi $Y=1$ (Peluang 0.6).
- **Pohon 3**: Prediksi $Y=0$ (Peluang 0.3) karena model pohon ini fokus ke tier harga.
- **Pohon 4**: Prediksi $Y=1$ (Peluang 0.7).
- **Pohon 5**: Prediksi $Y=1$ (Peluang 0.75).

### Langkah 3: Perhitungan Final (Averaging / Majority Voting)
Probabilitas final produk laku:
$$ P(Y=1 | X) = \frac{0.8 + 0.6 + 0.3 + 0.7 + 0.75}{5} = \frac{3.15}{5} = 0.63 $$

Hasil: **63% (Peluang Laku)**.
Karena 63% > 50%, sistem menetapkan Kesimpulan sebagai **Cukup Menarik**.
