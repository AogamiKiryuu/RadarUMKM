# Cara Kerja Sistem Rekomendasi Bisnis

Sistem rekomendasi bisnis **tidak menggunakan model ML**, melainkan pendekatan **rule-based + analisis statistik** yang membandingkan data input user terhadap benchmark pasar dari database produk nyata.

---

## Alur Keseluruhan

```
User Input (Form Rekomendasi)
        ↓
POST /api/recommendations/analyze  (Nuxt Server → Prisma → PostgreSQL)
        ↓
1. Query kompetitor dari DB
2. Hitung benchmark pasar (avg, min, max)
3. Analisis 3 faktor → generate strategi
4. Hitung Skor Peluang (0–100)
        ↓
Response JSON → Render 4 strategy cards + KPI + top seller
```

---

## Step-by-Step Perhitungan

### Step 1 — Ambil Data Kompetitor

```typescript
// Ambil max 50 produk sejenis berdasarkan kategori, urut terlaris
const competitors = await prisma.product.findMany({
  where: { kategori },
  orderBy: { jumlahTerjual: 'desc' },
  take: 50,
});

// Perkecil ke sub kategori jika ada (lebih relevan)
const closeCompetitors = subKategori
  ? competitors.filter(p => p.subKategori === subKategori).slice(0, 20)
  : competitors.slice(0, 20);

// Fallback: jika sub kategori < 5 produk, gunakan level kategori
const pool = closeCompetitors.length >= 5 ? closeCompetitors : competitors.slice(0, 20);
```

### Step 2 — Hitung Benchmark Pasar

$$\bar{H} = \frac{1}{N}\sum_{i=1}^{N} H_i \quad \text{(rata-rata harga)}$$

$$\bar{R} = \frac{1}{N}\sum_{i=1}^{N} R_i \quad \text{(rata-rata rating)}$$

$$\bar{T} = \frac{1}{N}\sum_{i=1}^{N} T_i \quad \text{(rata-rata terjual)}$$

Di mana $N$ = jumlah produk di pool kompetitor.

```typescript
const avgHarga  = Math.round(pool.reduce((s, p) => s + p.hargaProduk, 0) / pool.length);
const avgRating = Number((pool.reduce((s, p) => s + p.rating, 0) / pool.length).toFixed(2));
const avgTerjual = Math.round(pool.reduce((s, p) => s + p.jumlahTerjual, 0) / pool.length);
```

---

## Analisis 4 Strategi

### Strategi 1 — Harga

Berdasarkan selisih persentase harga user ($H_u$) terhadap rata-rata pasar ($\bar{H}$):

$$\Delta H\% = \frac{H_u - \bar{H}}{\bar{H}} \times 100\%$$

| Kondisi | Status | Keterangan |
|---|---|---|
| $\Delta H\% > +25\%$ | 🔴 `danger` | Terlalu mahal, tidak kompetitif |
| $\Delta H\% < -20\%$ | 🟡 `warning` | Terlalu murah, risiko margin tipis |
| $-20\% \leq \Delta H\% \leq +25\%$ | 🟢 `ok` | Harga kompetitif |

### Strategi 2 — Kualitas & Rating

Berdasarkan selisih antara target rating user ($R_u$) dan rata-rata pasar ($\bar{R}$):

$$\Delta R = R_u - \bar{R}$$

| Kondisi | Status | Keterangan |
|---|---|---|
| $R_u = 0$ | 🟡 `warning` | Belum ada rating, produk baru |
| $\Delta R < -0.3$ | 🔴 `danger` | Target rating di bawah rata-rata pasar |
| $\Delta R \geq -0.3$ | 🟢 `ok` | Target rating kompetitif |

### Strategi 3 — Analisis Kompetisi

Berdasarkan total kompetitor di kategori ($K$):

| Kondisi | Status | Keterangan |
|---|---|---|
| $K > 30$ | 🔴 `danger` | Pasar sangat ramai |
| $10 < K \leq 30$ | 🟡 `warning` | Kompetisi moderat |
| $K \leq 10$ | 🟢 `ok` | Pasar terbuka, peluang besar |

### Strategi 4 — Marketing

Selalu `ok` — berisi checklist langkah marketing standar marketplace yang berlaku untuk semua produk.

---

## Perhitungan Skor Peluang (0–100)

Skor dimulai dari **base score = 50**, lalu ditambahkan poin dari tiap strategi:

$$\text{Skor} = 50 + S_{\text{harga}} + S_{\text{rating}} + S_{\text{kompetisi}}$$

Di mana:

| Variabel | Status `ok` | Status `warning` | Status `danger` |
|---|---|---|---|
| $S_{\text{harga}}$ | +15 | +5 | +0 |
| $S_{\text{rating}}$ | +20 | +5 | +0 |
| $S_{\text{kompetisi}}$ | +15 | +7 | +0 |

**Rentang skor maksimum:** $50 + 15 + 20 + 15 = 100$

**Label berdasarkan skor:**

| Rentang | Label |
|---|---|
| ≥ 75 | Peluang Tinggi |
| 55 – 74 | Peluang Moderat |
| < 55 | Perlu Persiapan Lebih |

---

## Perhitungan KPI Target

```typescript
// Target penjualan bulanan = 30% dari rata-rata kompetitor (minimal 50 unit)
const targetBulananTerjual = Math.max(50, Math.round(avgTerjual * 0.3));
```

$$T_{\text{target}} = \max(50,\ \lfloor 0.3 \times \bar{T} \rfloor)$$

KPI yang direkomendasikan:

| KPI | Formula/Target |
|---|---|
| Target Penjualan | $T_{\text{target}}$ s/d $2T_{\text{target}}$ unit/bulan |
| Target Rating | $\geq \max(R_u, \bar{R})$ |
| Response Rate | > 90% |
| Return Rate | < 5% |

---

## Response JSON

```json
{
  "score": 72,
  "scoreLabel": "Peluang Moderat",
  "avgHargaKompetitor": 45000,
  "avgRatingKompetitor": 4.6,
  "avgTerjualKompetitor": 87,
  "priceRange": { "min": 25000, "max": 85000 },
  "strategies": [
    {
      "id": "harga",
      "title": "Strategi Harga",
      "status": "ok",
      "headline": "Harga Anda sudah kompetitif dan sesuai pasar",
      "actions": ["..."]
    }
  ],
  "kpis": [...],
  "topSeller": { "nama_produk": "...", "harga_produk": 45000, "rating": 4.9, ... },
  "similarProducts": [...]
}
```

---

## Perbedaan dengan Sistem Prediksi

| Aspek | Prediksi Tren Pasar | Rekomendasi Bisnis |
|---|---|---|
| Teknologi | Machine Learning (Random Forest) | Rule-based + Statistik |
| Server | Flask (Python) port 5001 | Nuxt Server API (TypeScript) |
| Data | Dataset CSV + model .joblib | PostgreSQL via Prisma |
| Output | Probabilitas daya tarik produk | Strategi + skor peluang bisnis |
| Fokus | "Apakah produk ini akan laku?" | "Apa yang harus dilakukan agar laku?" |
