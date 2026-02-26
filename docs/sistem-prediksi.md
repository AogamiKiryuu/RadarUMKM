# Cara Kerja Sistem Prediksi Tren Pasar

Sistem prediksi menggunakan **Machine Learning (Random Forest / Gradient Boosting)** yang dilatih dari data nyata scraped di Tokopedia, Shopee, dan Lazada untuk produk UMKM Bogor.

---

## Alur Keseluruhan

```
User Input (Nuxt Form)
        ↓
POST /api/predict  (Nuxt Server)
        ↓
POST http://localhost:5001/predict  (Flask API)
        ↓
1. Validasi Input
2. Text Preprocessing (Sastrawi Stemmer)
3. TF-IDF Cosine Similarity → cari kompetitor
4. ML Inference → probabilitas daya tarik
5. Bangun alasan narasi
        ↓
Response JSON → Render di prediksi.vue
```

---

## Komponen Teknis

### 1. Model ML (`model_umkm_bogor.joblib`)

Model disimpan sebagai **scikit-learn Pipeline** yang terdiri dari:

```
Pipeline(
  preprocessor: ColumnTransformer(
    [0] TfidfVectorizer  ← untuk kolom nama_produk_clean
    [1] OrdinalEncoder   ← untuk kolom kategori & sub_kategori
    [2] MinMaxScaler     ← untuk kolom harga_produk & rating
  ),
  classifier: RandomForestClassifier / GradientBoostingClassifier
)
```

**Label target (binary classification):**
- `1` = Produk menarik / berpeluang laku
- `0` = Produk kurang menarik

### 2. Text Preprocessing

Sebelum dimasukkan ke TF-IDF, nama produk diproses:

```python
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z\s]', ' ', text)   # hapus angka & simbol
    words = [w for w in text.split()
             if w not in list_stopwords]      # buang stopwords
    return stemmer.stem(' '.join(words))      # stemming Bahasa Indonesia
```

**Stopwords kustom:** `murah`, `promo`, `cod`, `terlaris`, `original`, `ori`, `asli`, `oleh`, `pcs`, `gr`, `gram`, `kg`, `dan`, `di`, `ke`, `dari`, `yang`

**Stemmer:** PySastrawi (Bahasa Indonesia)

### 3. Pencarian Kompetitor (Cosine Similarity)

Untuk menemukan produk serupa di database:

$$\text{similarity}(q, d) = \frac{\vec{q} \cdot \vec{d}}{|\vec{q}||\vec{d}|}$$

Di mana:
- $\vec{q}$ = vektor TF-IDF dari nama produk input user
- $\vec{d}$ = vektor TF-IDF dari setiap produk di database

**TF-IDF Formula:**

$$\text{TF-IDF}(t, d) = \text{TF}(t,d) \times \text{IDF}(t)$$

$$\text{IDF}(t) = \log\left(\frac{N}{1 + df(t)}\right)$$

Di mana:
- $t$ = term (kata)
- $d$ = dokumen (nama produk)
- $N$ = total dokumen
- $df(t)$ = jumlah dokumen yang mengandung term $t$

**Threshold kemiripan:** hanya kompetitor dengan similarity score > 0.05 yang ditampilkan.

Implementasi di Flask:
```python
# Pre-cache TF-IDF saat server start (efisiensi)
tfidf_vectorizer = rf_pipeline.named_steps['preprocessor'].transformers_[0][1]
X_train_text_db = tfidf_vectorizer.transform(df['nama_produk_clean'].fillna(''))

# Saat request masuk
query_vec = tfidf_vectorizer.transform([query_clean])
sim_scores = cosine_similarity(query_vec, X_train_text_db).flatten()
top_indices = sim_scores.argsort()[-5:][::-1]   # ambil 5 teratas
```

### 4. Prediksi Probabilitas

```python
input_df = pd.DataFrame([{
    'nama_produk_clean': query_clean,
    'kategori': kategori_input,
    'sub_kategori': sub_kategori_input,
    'harga_produk': harga_input,
    'rating': rating_input
}])

probabilitas = rf_pipeline.predict_proba(input_df)[0][1]
```

`predict_proba` mengembalikan `[prob_kelas_0, prob_kelas_1]`.  
Kita ambil index `[1]` = probabilitas produk **menarik**.

**Skala Output:**

| Rentang Probabilitas | Label |
|---|---|
| ≥ 70% | 🌟 SANGAT MENARIK |
| 50% – 69% | ✅ CUKUP MENARIK |
| < 50% | ⚠️ KURANG MENARIK |

---

## Validasi Input

### Validasi 1 — Mismatch Kategori

Flask memiliki mapping 100+ produk khas Bogor ke kategori yang benar. Jika nama produk mengandung kata kunci tertentu tapi kategori yang dipilih tidak cocok, API mengembalikan error.

Contoh: `"Kopi Puncak Bogor"` + kategori `"Makanan"` → **error**, seharusnya `"Minuman"`.

### Validasi 2 — Identitas Bogor

Produk harus mengandung kata kunci wilayah Bogor (70+ keyword: nama kecamatan, produk ikonik, dll). Jika tidak ada identitas Bogor sama sekali **dan** tidak ada kompetitor serupa → API menolak dengan pesan panduan.

---

## Contoh Alasan Prediksi (Narasi Otomatis)

Alasan dibangun dari beberapa komponen yang digabung:

```
"Terdapat 3 produk serupa di marketplace; harga Anda 15% lebih murah dari 
rata-rata kompetitor (Rp45.000); produk sejenis memiliki permintaan sedang 
dengan rata-rata 47 terjual; model menilai produk Anda cukup berpotensi, 
namun masih ada ruang untuk optimasi harga atau penamaan."
```

---

## Response JSON

```json
{
  "status": "success",
  "kesimpulan": "✅ CUKUP MENARIK",
  "peluang_laku_persen": 63.4,
  "alasan": "...",
  "kompetitor": [
    {
      "nama": "Lapis Talas Bogor Original",
      "harga": 45000,
      "rating": 4.8,
      "terjual": 234,
      "marketplace": "Shopee",
      "url_produk": "https://...",
      "kemiripan_persen": 78.2
    }
  ]
}
```

---

## Diagram Matematis Ringkas

$$\text{Skor Peluang} = P(\text{label}=1 \mid \text{nama}, \text{kategori}, \text{sub\_kategori}, \text{harga}, \text{rating})$$

Model Random Forest mengagregasi prediksi $T$ decision trees:

$$P(\text{label}=1) = \frac{1}{T} \sum_{t=1}^{T} \mathbb{1}[h_t(\mathbf{x}) = 1]$$

Di mana $h_t(\mathbf{x})$ adalah prediksi pohon ke-$t$ untuk input $\mathbf{x}$.
