// server/plugins/migrate.ts
// Plugin ini sudah tidak aktif — migration dan seeding dilakukan via:
//   npx prisma migrate deploy (untuk schema)
//   node scripts/import-products.js (untuk data produk)
// Database production ada di Supabase.

export default defineNitroPlugin(async () => {
  // Tidak ada aksi — migration & seeding sudah dilakukan secara manual ke Supabase.
  if (process.env.NODE_ENV === 'production') {
    console.log('[migrate] ✅ Skipping — production database managed by Supabase.');
  }
});
