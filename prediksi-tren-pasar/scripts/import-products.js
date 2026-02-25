/**
 * Script untuk import data produk dari CSV ke PostgreSQL
 * 
 * Usage:
 * 1. Pastikan file CSV ada di: data/raw/produk_bogor.csv
 * 2. Run: node scripts/import-products.js
 */

import { PrismaClient } from '../app/generated/prisma/index.js'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting product import...\n')

  // Path ke file CSV
  const csvPath = path.join(process.cwd(), 'data', 'raw', 'produk_bogor.csv')

  // Check if file exists
  if (!fs.existsSync(csvPath)) {
    console.error('❌ File CSV tidak ditemukan di:', csvPath)
    console.log('\n📝 Pastikan file CSV ada di: data/raw/produk_bogor.csv')
    process.exit(1)
  }

  // Read CSV file
  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  
  // Parse CSV dengan header
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  console.log(`📦 Found ${records.length} products in CSV\n`)

  // Clear existing products (optional - comment jika tidak ingin hapus data lama)
  console.log('🗑️  Clearing existing products...')
  await prisma.product.deleteMany({})
  console.log('✅ Cleared\n')

  // Import products
  let imported = 0
  let failed = 0

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    
    try {
      await prisma.product.create({
        data: {
          namaProduk: record.nama_produk || record.namaProduk || '',
          namaToko: record.nama_toko || record.namaToko || null,
          
          // Handle price conversion (jika ada format "Rp 50.000" atau "50000")
          hargaProduk: parseFloat(
            String(record.harga_produk || record.hargaProduk || 0)
              .replace(/[^0-9]/g, '')
          ),
          
          // Handle sold quantity
          jumlahTerjual: parseInt(
            String(record.jumlah_terjual || record.jumlahTerjual || 0)
              .replace(/[^0-9]/g, '')
          ) || 0,
          
          // Handle rating
          rating: parseFloat(record.rating || 0) || 0,
          
          kategori: record.kategori || 'Lainnya',
          subKategori: record.sub_kategori || record.subKategori || null,
          
          // Label (0 = Kurang Menarik, 1 = Menarik)
          label: parseInt(record.label || 0) || null,
          
          url: record.url || null
        }
      })
      
      imported++
      
      // Progress indicator
      if ((i + 1) % 50 === 0) {
        console.log(`⏳ Imported ${i + 1}/${records.length} products...`)
      }
      
    } catch (error) {
      failed++
      console.error(`❌ Failed to import product at row ${i + 1}:`, error.message)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Import Summary:')
  console.log('='.repeat(50))
  console.log(`✅ Successfully imported: ${imported}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Total processed: ${records.length}`)
  console.log('='.repeat(50) + '\n')

  // Show sample data
  console.log('📝 Sample imported data (first 3 products):\n')
  const sampleProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  sampleProducts.forEach((product, idx) => {
    console.log(`${idx + 1}. ${product.namaProduk}`)
    console.log(`   Kategori: ${product.kategori}`)
    console.log(`   Harga: Rp ${product.hargaProduk.toLocaleString('id-ID')}`)
    console.log(`   Rating: ${product.rating} ⭐`)
    console.log(`   Terjual: ${product.jumlahTerjual} unit`)
    console.log(`   Label: ${product.label === 1 ? 'Menarik' : 'Kurang Menarik'}`)
    console.log()
  })

  console.log('✨ Import completed successfully!')
  console.log('\n💡 Tip: Jalankan "npx prisma studio" untuk melihat data di browser')
}

main()
  .catch((e) => {
    console.error('\n💥 Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
