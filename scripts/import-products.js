// scripts/import-products.js
// Seeder: baca CSV dan insert ke tabel products di PostgreSQL
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma/client.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL tidak ditemukan. Set environment variable DATABASE_URL terlebih dulu.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CSV_PATH = path.join(__dirname, '../data/processed/dataset_umkm_bogor.csv');

async function main() {
  console.log('📂 Membaca CSV:', CSV_PATH);

  const records = await new Promise((resolve, reject) => {
    const rows = [];
    createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, trim: true, skip_empty_lines: true }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });

  console.log(`📊 Total data: ${records.length} produk`);

  // Cek apakah sudah ada data
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`⚠️  Tabel products sudah ada ${existingCount} data. Skip seeding.`);
    await prisma.$disconnect();
    return;
  }

  console.log('⏳ Menyimpan ke database...');

  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    await prisma.product.createMany({
      data: batch.map((row) => ({
        namaProduk: row['nama_produk'] || '',
        kategori: row['kategori'] || '',
        subKategori: row['sub_kategori'] || null,
        hargaProduk: parseInt(row['harga_produk']) || 0,
        jumlahTerjual: parseInt(row['jumlah_terjual']) || 0,
        rating: parseFloat(row['rating']) || 0.0,
        namaToko: row['nama_toko'] || null,
        url: row['url_produk'] || null,
        label: row['label'] !== '' ? parseInt(row['label']) : null,
      })),
      skipDuplicates: true,
    });

    inserted += batch.length;
    process.stdout.write(`\r✅ ${inserted}/${records.length} data tersimpan...`);
  }

  console.log(`\n🎉 Selesai! ${inserted} produk berhasil dimasukkan ke database.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  prisma.$disconnect();
  process.exit(1);
});
