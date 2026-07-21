# Dokumentasi RadarUMKMBogor

Dokumentasi lengkap sistem **RadarUMKMBogor** — aplikasi prediksi daya tarik produk UMKM berbasis Machine Learning.

---

## Daftar Dokumen

| File | Isi |
|------|-----|
| [01-overview.md](./01-overview.md) | Gambaran umum sistem, arsitektur, dan alur kerja |
| [02-web-frontend.md](./02-web-frontend.md) | Dokumentasi aplikasi web (Nuxt.js / Vue.js) |
| [03-web-backend.md](./03-web-backend.md) | Dokumentasi server API (Nitro / Nuxt Server) |
| [04-machine-learning.md](./04-machine-learning.md) | Dokumentasi model ML dan Flask API |
| [05-database.md](./05-database.md) | Dokumentasi database (Supabase / PostgreSQL) |
| [06-deployment.md](./06-deployment.md) | Panduan deployment ke Vercel & Render |
| [07-algoritma-prediksi.md](./07-algoritma-prediksi.md) | Perhitungan Matematis & Cara Kerja Algoritma Prediksi |

---

## Diagram Sistem (Mermaid)

| Diagram | Link |
|---------|------|
| Arsitektur Sistem | [diagrams/arsitektur.mmd](./diagrams/arsitektur.mmd) |
| Entity Relationship Diagram (ERD) | [diagrams/erd.mmd](./diagrams/erd.mmd) |

---

## Tech Stack Ringkas

```
Frontend   : Nuxt 4 + Vue 3 + Nuxt UI + Chart.js
Backend    : Nitro (Nuxt Server) + pg + Prisma ORM
ML API     : Python Flask + scikit-learn + pandas
Database   : PostgreSQL (Supabase)
Deploy Web : Vercel
Deploy ML  : Render
```
