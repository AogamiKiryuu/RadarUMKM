# Aplikasi Prediksi Tren Pasar

Sistem Prediksi Daya Tarik Produk Khas Bogor Berbasis Text Mining dan Machine Learning

## 🚀 Teknologi yang Digunakan

- **Frontend**: Nuxt 3 + Vue 3
- **UI Framework**: Nuxt UI (TailwindCSS)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: nuxt-auth-utils
- **State Management**: Pinia
- **Charts**: Chart.js + Vue-ChartJS
- **Backend ML**: Flask API (Python)

## 📁 Struktur Aplikasi

```
├── pages/
│   ├── index.vue           # Halaman Login/Register
│   ├── dashboard.vue       # Dashboard dengan Charts
│   ├── prediksi.vue        # Halaman Prediksi Tren Pasar
│   └── rekomendasi.vue     # Halaman Analisis Rekomendasi
├── server/
│   ├── api/
│   │   ├── auth/          # API Authentication
│   │   ├── dashboard/     # API Dashboard Stats
│   │   ├── predictions/   # API Predictions
│   │   └── recommendations/ # API Recommendations
│   └── utils/
│       └── prisma.ts      # Prisma Client Instance
├── middleware/
│   └── auth.ts            # Authentication Middleware
├── prisma/
│   ├── schema.prisma      # Database Schema
│   └── migrations/        # Database Migrations
└── app/
    └── generated/
        └── prisma/        # Generated Prisma Client
```

## 🗃️ Database Schema

### User

- id, email, password, name, timestamps
- Relations: predictions, businessRecommendations

### Product

- Menyimpan data produk dari e-commerce
- Fields: namaProduk, kategori, subKategori, hargaProduk, rating, jumlahTerjual, dll

### Prediction

- Menyimpan history prediksi user
- Fields: namaProduk, kategori, hargaProduk, targetRating, predictionScore, insight

### BusinessRecommendation

- Menyimpan analisis rekomendasi bisnis
- Fields: produk info, similarProducts, avgHarga/Rating kompetitor, recommendations

## 🔧 Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Pastikan PostgreSQL sudah berjalan dengan database `prediksi_tren_pasar`:

```bash
# Windows (jika belum ada database)
psql -U postgres
CREATE DATABASE prediksi_tren_pasar;
\q
```

### 3. Configure Environment Variables

File `.env` sudah dikonfigurasi dengan:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prediksi_tren_pasar"
FLASK_API_URL="http://localhost:5000"
```

### 4. Run Migrations (Sudah Selesai)

Database tables sudah dibuat. Jika perlu reset:

```bash
npx prisma migrate reset
npx prisma generate
```

### 5. Insert Sample Data (Optional)

Untuk testing, Anda bisa import data produk CSV ke tabel `products`

### 6. Setup Flask API (Python)

Di folder terpisah untuk Flask API:

```bash
pip install flask flask-cors scikit-learn pandas numpy nltk sastrawi
python app.py
```

Flask API harus memiliki endpoint:

- POST `/predict` - menerima data produk, return prediction_score & prediction_label

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📊 Alur Penggunaan Aplikasi

### 1. Login / Register

- User membuat akun atau login dengan email/password
- Session disimpan menggunakan nuxt-auth-utils

### 2. Dashboard

- Menampilkan statistik produk:
  - Total produk, rata-rata harga, rating, total terjual
- Charts:
  - Top 10 produk terlaris (Bar Chart)
  - Distribusi kategori (Pie Chart)
  - Produk rating tertinggi (Bar Chart)
  - Distribusi harga (Line Chart)

### 3. Prediksi Tren Pasar

- Input: Nama Produk, Kategori, Sub Kategori, Harga, Target Rating
- Sistem memanggil Flask API untuk ML prediction
- Output:
  - Skor prediksi (0-100%)
  - Label (Menarik/Kurang Menarik)
  - Insight & analisis
  - Daftar produk kompetitor serupa
- User bisa save ke history

### 4. Analisis Rekomendasi Bisnis

- Input: Data produk yang sama
- Sistem menganalisis:
  - Perbandingan harga dengan pasar
  - Perbandingan rating dengan kompetitor
  - Analisis kompetitor (tabel lengkap)
- Output rekomendasi meliputi:
  1. Strategi Penetapan Harga
  2. Strategi Kualitas & Rating
  3. Analisis Kompetisi
  4. Rekomendasi Marketing
  5. Target & KPI
- Bisa download PDF (coming soon)

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Dashboard

- `GET /api/dashboard/stats` - Get statistics & charts data

### Prediction

- `POST /api/predict` - Predict product attractiveness
- `POST /api/predictions/save` - Save prediction to history

### Recommendation

- `POST /api/recommendations/analyze` - Analyze & get recommendations
- `POST /api/recommendations/save` - Save recommendation

## 🎨 Pages & Features

### `/` - Login Page

- Login form
- Register form (toggle)
- Form validation
- Error handling with toast notifications

### `/dashboard` - Dashboard

- Protected route (requires auth)
- Real-time statistics cards
- Interactive charts (Chart.js)
- Navigation to Prediksi & Rekomendasi
- Logout button

### `/prediksi` - Prediction Page

- Protected route
- Form input produk
- Integration dengan Flask ML API
- Display prediction score & label
- Show insights & similar products
- Save to history function
- Navigate to Rekomendasi page

### `/rekomendasi` - Business Recommendation

- Protected route
- Form input produk
- Market comparison cards
- Comprehensive recommendations (Markdown formatted)
- Competitor analysis table
- Save & Download PDF functions

## 🧪 Testing

Untuk testing tanpa Flask API:

- API `/predict` akan return mock data jika Flask tidak tersedia
- Tetap bisa test seluruh flow aplikasi

## 📝 Database Seeding

Untuk populate database dengan data produk:

1. Export CSV dari hasil scraping
2. Import ke PostgreSQL:

```sql
COPY products(nama_produk, kategori, sub_kategori, harga_produk, rating, jumlah_terjual, nama_toko, url, label)
FROM 'path/to/data.csv'
DELIMITER ','
CSV HEADER;
```

## 🚧 TODO / Future Improvements

- [ ] PDF export untuk recommendations
- [ ] History page untuk melihat prediksi/rekomendasi sebelumnya
- [ ] Chart filters & date ranges
- [ ] Email notifications
- [ ] Export data to Excel
- [ ] Admin dashboard untuk manage products
- [ ] Real-time updates dengan WebSocket

## 📞 Support

Untuk pertanyaan atau issues, silakan hubungi developer.

---

**Made with ❤️ for UMKM Bogor**
