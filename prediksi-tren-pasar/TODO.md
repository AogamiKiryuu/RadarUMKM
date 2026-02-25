# 📋 TODO LIST - Prediksi Tren Pasar Application

## ✅ SELESAI
- [x] Setup Nuxt 3 application
- [x] Install dependencies (Prisma, Nuxt UI, Chart.js, Auth)
- [x] Create database schema (Users, Products, Predictions, BusinessRecommendations)
- [x] Create authentication system (Login/Register)
- [x] Create UI pages (Dashboard, Prediksi, Rekomendasi)
- [x] Create API endpoints structure
- [x] Setup PostgreSQL database connection

---

## 🔴 PRIORITAS TINGGI - HARUS DIKERJAKAN

### 1. 📊 Import Data Produk ke Database
**Status:** Belum  
**Estimasi:** 30 menit

#### Langkah:
- [ ] Buat folder `data/raw/` di root project
- [ ] Copy file CSV hasil scraping ke `data/raw/produk_bogor.csv`
- [ ] Install csv-parse: `npm install csv-parse`
- [ ] Buat file `scripts/import-products.js` untuk import CSV
- [ ] Sesuaikan mapping kolom CSV dengan schema Prisma
- [ ] Jalankan import script: `node scripts/import-products.js`
- [ ] Verifikasi data masuk dengan: `npx prisma studio`

**File CSV harus punya kolom:**
```
nama_produk, kategori, sub_kategori, harga_produk, rating, 
jumlah_terjual, nama_toko, url, label, nama_produk_clean (optional)
```

---

### 2. 🤖 Setup Flask API untuk Model ML
**Status:** Belum  
**Estimasi:** 1-2 jam

#### Langkah:
- [ ] Buat folder `flask_api/` di root project (sejajar dengan nuxt app)
- [ ] Buat folder `flask_api/models/` untuk menyimpan .pkl files
- [ ] Copy model files ke folder models/:
  - [ ] `random_forest_model.pkl`
  - [ ] `tfidf_vectorizer.pkl` 
  - [ ] `scaler.pkl`
  - [ ] `label_encoder.pkl` (jika ada)
- [ ] Buat `flask_api/requirements.txt`:
  ```
  flask==3.0.0
  flask-cors==4.0.0
  scikit-learn==1.3.0
  pandas==2.1.0
  numpy==1.24.0
  nltk==3.8.1
  Sastrawi==1.0.1
  ```
- [ ] Buat `flask_api/app.py` dengan endpoint `/predict`
- [ ] Implementasi text preprocessing (lowercase, stopwords, stemming)
- [ ] Load semua model files saat Flask startup
- [ ] Test endpoint dengan Postman/curl
- [ ] Install Python dependencies: `pip install -r requirements.txt`
- [ ] Jalankan Flask: `python app.py`

**Endpoint yang dibutuhkan:**
```python
POST /predict
Request Body:
{
  "nama_produk": "Lapis Talas Bogor Original",
  "kategori": "Makanan & Minuman",
  "sub_kategori": "Makanan Khas",
  "harga_produk": 75000,
  "rating": 4.8
}

Response:
{
  "prediction_score": 85.5,
  "prediction_label": 1,
  "confidence": 0.855
}
```

---

### 3. 🔗 Integrations & Connections
**Status:** Belum  
**Estimasi:** 30 menit

- [ ] Update `.env` dengan Flask API URL (sudah ada)
- [ ] Test koneksi Flask API dari Nuxt
- [ ] Handle error jika Flask API tidak tersedia
- [ ] Test flow: Input form → API call → Display results

---

## 🟡 PRIORITAS SEDANG - TESTING & REFINEMENT

### 4. 🧪 Testing & Debugging
**Status:** Belum  
**Estimasi:** 1 jam

- [ ] Test user registration & login
- [ ] Test dashboard charts dengan data real
- [ ] Test prediksi flow dengan berbagai input
- [ ] Test rekomendasi flow
- [ ] Test save history functionality
- [ ] Fix bugs yang ditemukan
- [ ] Test pada different browsers (Chrome, Firefox, Edge)

---

### 5. 🎨 UI/UX Improvements (Optional)
**Status:** Belum  
**Estimasi:** 1-2 jam

- [ ] Add loading states & skeletons
- [ ] Add empty states untuk dashboard jika belum ada data
- [ ] Add error boundaries
- [ ] Improve responsive design untuk mobile
- [ ] Add tooltips untuk membantu user
- [ ] Add validation messages yang lebih jelas
- [ ] Add confirmation dialogs untuk actions

---

## 🟢 NICE TO HAVE - FUTURE ENHANCEMENTS

### 6. 📜 History & Analytics
**Status:** Belum  
**Estimasi:** 2 jam

- [ ] Buat page `/history` untuk melihat prediksi sebelumnya
- [ ] Buat API endpoint untuk fetch user predictions history
- [ ] Display dalam bentuk tabel dengan filter & sorting
- [ ] Add export to CSV/Excel functionality
- [ ] Show statistics: Total predictions, success rate, dll

---

### 7. 📄 PDF Export untuk Rekomendasi
**Status:** Belum  
**Estimasi:** 2 jam

- [ ] Install jsPDF atau pdfmake
- [ ] Implementasi PDF generation untuk rekomendasi
- [ ] Design PDF template dengan branding
- [ ] Add download button functionality
- [ ] Test PDF output quality

---

### 8. 🔐 Security & Production Ready
**Status:** Belum  
**Estimasi:** 2-3 jam

- [ ] Add rate limiting untuk API endpoints
- [ ] Add input validation & sanitization
- [ ] Add CSRF protection
- [ ] Setup proper error logging (Sentry/LogRocket)
- [ ] Add environment-based config (dev/staging/prod)
- [ ] Setup CI/CD pipeline
- [ ] Add database backup strategy
- [ ] Setup monitoring & alerts

---

### 9. 🚀 Deployment
**Status:** Belum  
**Estimasi:** 2-3 jam

#### Nuxt App:
- [ ] Build production: `npm run build`
- [ ] Deploy ke Vercel/Netlify/Railway
- [ ] Setup database di cloud (Supabase/Railway/Neon)
- [ ] Configure environment variables di hosting

#### Flask API:
- [ ] Deploy Flask ke Railway/Render/PythonAnywhere
- [ ] Setup persistent storage untuk model files
- [ ] Configure CORS untuk production domain
- [ ] Setup health check endpoint

---

### 10. 📚 Documentation
**Status:** Belum  
**Estimasi:** 1 jam

- [ ] Lengkapi README dengan setup instructions
- [ ] Buat API documentation
- [ ] Buat user guide with screenshots
- [ ] Document database schema
- [ ] Add code comments untuk complex logic
- [ ] Create demo video/gif

---

## 🎯 QUICK START GUIDE (Urutan Kerja)

### Hari 1: Backend & Data Setup
1. ✅ Import CSV ke database (Todo #1) - **MULAI DARI INI**
2. ✅ Setup Flask API (Todo #2) - **PALING PENTING**
3. ✅ Test Flask API endpoint
4. ✅ Verify Nuxt dapat hit Flask API

### Hari 2: Integration & Testing
5. ✅ Test full flow: Register → Login → Dashboard → Prediksi → Rekomendasi
6. ✅ Fix bugs & improve UX
7. ✅ Add error handling

### Hari 3: Polish & Deploy (Optional)
8. ✅ Add history page
9. ✅ Deploy to production
10. ✅ Final testing

---

## 🛠️ HELPER SCRIPTS YANG PERLU DIBUAT

### A. `scripts/import-products.js` (Lihat template di bawah)
### B. `flask_api/app.py` (Lihat template di bawah)
### C. `scripts/test-flask-api.js` (Untuk testing)

---

## 📝 CATATAN PENTING

1. **Model ML Location**: Model .pkl files HARUS ada di Flask API, bukan di Nuxt app
2. **Database**: Aplikasi Nuxt dan Flask API bisa pakai database yang sama (PostgreSQL)
3. **CORS**: Flask harus enable CORS untuk accept request dari Nuxt
4. **Error Handling**: API endpoint `/predict` sudah ada fallback ke mock data jika Flask down
5. **Development**: Jalankan Nuxt (`npm run dev`) dan Flask (`python app.py`) secara bersamaan

---

## ❓ TROUBLESHOOTING

### Flask API tidak terhubung?
- Pastikan Flask running di `http://localhost:5000`
- Check CORS settings di Flask
- Check `.env` file punya `FLASK_API_URL=http://localhost:5000`

### Database connection error?
- Pastikan PostgreSQL running
- Verify credentials di `.env`
- Test dengan `npx prisma studio`

### Charts tidak muncul?
- Pastikan ada data di table `products`
- Check console untuk errors
- Verify Chart.js registered correctly

---

## 🎓 UNTUK KEPERLUAN SKRIPSI

- [x] Dokumentasi arsitektur sistem
- [ ] Flowchart aplikasi
- [ ] Screenshot setiap fitur
- [ ] Hasil testing & evaluasi
- [ ] Perbandingan sebelum/sesudah menggunakan sistem
- [ ] User acceptance testing results
