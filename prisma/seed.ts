import 'dotenv/config';
import prisma from '../server/utils/prisma.ts';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

async function main() {
  console.log('Seeding database...');

  // Create default user if not exists
  const defaultUserEmail = 'admin@radarumkm.com';
  let user = await prisma.user.findUnique({ where: { email: defaultUserEmail } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: defaultUserEmail,
        name: 'Admin RadarUMKM',
        password: 'password123' // In a real app this should be hashed, but for seeding it's okay if login accepts cleartext or we hash it.
      }
    });
    console.log(`Created default user: ${defaultUserEmail} / password123`);
  }

  // Load and parse CSV
  const csvPath = path.resolve(process.cwd(), 'data/processed/dataset_umkm_bogor.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.log(`CSV file not found at ${csvPath}`);
    return;
  }

  console.log(`Reading CSV from ${csvPath}...`);
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true
  });

  console.log(`Found ${records.length} records. Uploading to database in batches...`);
  
  // Clear existing products to prevent duplicates on multiple seed runs
  await prisma.product.deleteMany({});
  
  // Prepare data for batch insert
  const products = records.map((record: any) => ({
    url: record.url_produk || null,
    namaProduk: record.nama_produk,
    kategori: record.kategori,
    subKategori: record.sub_kategori || null,
    hargaProduk: parseInt(record.harga_produk) || 0,
    jumlahTerjual: parseInt(record.jumlah_terjual) || 0,
    rating: parseFloat(record.rating) || 0,
    namaToko: record.nama_toko || null,
    label: record.label !== '' ? parseInt(record.label) : null
  }));

  // Insert in chunks of 500
  const chunkSize = 500;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    await prisma.product.createMany({
      data: chunk,
      skipDuplicates: true
    });
    console.log(`Inserted batch ${Math.floor(i/chunkSize) + 1} (${chunk.length} items)`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
