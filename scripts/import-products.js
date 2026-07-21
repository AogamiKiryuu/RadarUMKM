// scripts/import-products.js
// Seeder: baca CSV dan insert ke tabel products menggunakan pg langsung
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config(); // load .env

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Nonaktifkan validasi sertifikat SSL secara ketat untuk script import ini
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL tidak ditemukan. Set environment variable DATABASE_URL terlebih dulu.');
  process.exit(1);
}

// Gunakan DIRECT_URL jika ada (Supabase), fallback ke DATABASE_URL (lokal)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const client = new pg.Client({ 
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

// CSV: dataset_preprocessed.csv
const CSV_PATH = path.join(__dirname, '../data/processed/dataset_preprocessed.csv');

async function main() {
  await client.connect();
  console.log('✅ Terhubung ke database.');
  console.log('📂 Membaca CSV:', CSV_PATH);

  const records = await new Promise((resolve, reject) => {
    const rows = [];
    createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, trim: true, skip_empty_lines: true, relax_quotes: true }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });

  console.log(`📊 Total data: ${records.length} produk`);

  // Hapus data lama
  console.log('🗑️  Menghapus data lama dari tabel products...');
  await client.query('DELETE FROM products');

  console.log('⏳ Menyimpan ke database...');

  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    // Build bulk insert query
    const values = [];
    const placeholders = batch.map((row, idx) => {
      const base = idx * 12;
      const url            = row['url_produk']     || null;
      const namaProduk     = row['nama_produk']    || '';
      const kategori       = row['kategori']       || '';
      const subKategori    = row['sub_kategori']   || null;
      const marketplace    = row['marketplace']    || null;
      const lokasi         = row['lokasi_clean']   || row['lokasi'] || null;
      const namaToko       = row['nama_toko']      || null;
      const hargaProduk    = parseInt(row['harga_produk'])    || 0;
      const jumlahTerjual  = parseInt(row['jumlah_terjual'])  || 0;
      const rating         = parseFloat(row['rating'])        || 0.0;
      const popularityScore = row['popularity_score'] !== '' ? parseFloat(row['popularity_score']) : null;
      const hargaTier      = row['harga_tier']     !== '' ? parseInt(row['harga_tier'])            : null;

      values.push(url, namaProduk, kategori, subKategori, marketplace, lokasi, namaToko,
                  hargaProduk, jumlahTerjual, rating, popularityScore, hargaTier);

      return `(gen_random_uuid(), $${base+1}, $${base+2}, $${base+3}, $${base+4}, $${base+5}, $${base+6}, $${base+7}, $${base+8}, $${base+9}, $${base+10}, $${base+11}, $${base+12}, NOW())`;
    });

    const query = `
      INSERT INTO products (id, url, "namaProduk", "kategori", "subKategori", marketplace, lokasi, "namaToko", "hargaProduk", "jumlahTerjual", rating, "popularityScore", "hargaTier", "createdAt")
      VALUES ${placeholders.join(', ')}
    `;

    await client.query(query, values);
    inserted += batch.length;
    process.stdout.write(`\r✅ ${inserted}/${records.length} data tersimpan...`);
  }

  console.log(`\n🎉 Selesai! ${inserted} produk berhasil dimasukkan ke database.`);
  await client.end();
}

main().catch(async (e) => {
  console.error('\n❌ Error:', e.message);
  await client.end();
  process.exit(1);
});
