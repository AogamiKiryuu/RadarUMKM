// server/plugins/migrate.ts
// Jalankan SQL migration + seeding sebelum server menerima request pertama
import { readFileSync, readdirSync, createReadStream } from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import pg from 'pg';
const { Pool } = pg;

export default defineNitroPlugin(async () => {
  if (process.env.NODE_ENV !== 'production') return;

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('[migrate] ❌ DATABASE_URL tidak ditemukan.');
    return;
  }

  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    const client = await pool.connect();

    try {
      // ── 1. MIGRATION ────────────────────────────────────────────────────────
      await client.query(`
        CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
          id                  VARCHAR(36) PRIMARY KEY,
          checksum            VARCHAR(64) NOT NULL,
          finished_at         TIMESTAMPTZ,
          migration_name      VARCHAR(255) NOT NULL,
          logs                TEXT,
          rolled_back_at      TIMESTAMPTZ,
          started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          applied_steps_count INTEGER NOT NULL DEFAULT 0
        )
      `);

      const migrationsDir = path.join(process.cwd(), 'prisma/migrations');
      let entries: string[] = [];
      try {
        entries = readdirSync(migrationsDir, { withFileTypes: true })
          .filter((e) => e.isDirectory())
          .map((e) => e.name)
          .sort();
      } catch {
        console.log('[migrate] Folder migrations tidak ditemukan, skip.');
      }

      for (const migrationName of entries) {
        const sqlPath = path.join(migrationsDir, migrationName, 'migration.sql');
        let sql: string;
        try {
          sql = readFileSync(sqlPath, 'utf8');
        } catch {
          continue;
        }

        const { rows } = await client.query(`SELECT id FROM "_prisma_migrations" WHERE migration_name = $1 AND finished_at IS NOT NULL`, [migrationName]);
        if (rows.length > 0) {
          console.log(`[migrate] ⏭️  Skip: ${migrationName}`);
          continue;
        }

        console.log(`[migrate] ⚡ Applying: ${migrationName}`);
        const id = crypto.randomUUID();
        await client.query(`INSERT INTO "_prisma_migrations" (id, checksum, migration_name) VALUES ($1, $2, $3)`, [id, 'plugin', migrationName]);
        await client.query(sql);
        await client.query(`UPDATE "_prisma_migrations" SET finished_at = NOW(), applied_steps_count = 1 WHERE id = $1`, [id]);
        console.log(`[migrate] ✅ Applied: ${migrationName}`);
      }
      console.log('[migrate] ✅ Migration selesai!');

      // ── 2. SEEDING ──────────────────────────────────────────────────────────
      const { rows: countRows } = await client.query('SELECT COUNT(*) FROM products');
      const count = parseInt(countRows[0].count);

      if (count > 0) {
        console.log(`[seed] ⏭️  Skip: tabel products sudah ada ${count} data.`);
      } else {
        const csvPath = path.join(process.cwd(), 'data/processed/dataset_umkm_bogor.csv');
        console.log('[seed] ⏳ Membaca CSV dan menyimpan ke database...');

        const records: any[] = await new Promise((resolve, reject) => {
          const rows: any[] = [];
          createReadStream(csvPath)
            .pipe(parse({ columns: true, trim: true, skip_empty_lines: true }))
            .on('data', (r) => rows.push(r))
            .on('end', () => resolve(rows))
            .on('error', reject);
        });

        let inserted = 0;
        const batchSize = 50;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          for (const row of batch) {
            await client.query(
              `INSERT INTO products ("id","namaProduk","kategori","subKategori","hargaProduk","jumlahTerjual","rating","namaToko","url","label","createdAt","updatedAt")
               VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())`,
              [
                row['nama_produk'] || '',
                row['kategori'] || '',
                row['sub_kategori'] || null,
                parseInt(row['harga_produk']) || 0,
                parseInt(row['jumlah_terjual']) || 0,
                parseFloat(row['rating']) || 0.0,
                row['nama_toko'] || null,
                row['url_produk'] || null,
                row['label'] !== '' ? parseInt(row['label']) : null,
              ],
            );
            inserted++;
          }
          console.log(`[seed] ${inserted}/${records.length}`);
        }
        console.log(`[seed] ✅ ${inserted} produk berhasil disimpan!`);
      }
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err: any) {
    console.error('[migrate] ❌ Error:', err.message);
  }
});
