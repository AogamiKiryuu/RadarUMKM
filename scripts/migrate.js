// scripts/migrate.js
// Jalankan migration SQL langsung via pg, tanpa Prisma CLI
import { readFileSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL tidak ditemukan.');
  process.exit(1);
}

const { Pool } = require('pg');
const pool = new Pool({ connectionString: DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    // Buat tabel _prisma_migrations jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        id                      VARCHAR(36) PRIMARY KEY,
        checksum                VARCHAR(64) NOT NULL,
        finished_at             TIMESTAMPTZ,
        migration_name          VARCHAR(255) NOT NULL,
        logs                    TEXT,
        rolled_back_at          TIMESTAMPTZ,
        started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        applied_steps_count     INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Baca folder migrations
    const migrationsDir = path.join(__dirname, '../prisma/migrations');
    const entries = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    for (const migrationName of entries) {
      const sqlPath = path.join(migrationsDir, migrationName, 'migration.sql');
      let sqlFile;
      try {
        sqlFile = readFileSync(sqlPath, 'utf8');
      } catch {
        continue; // skip jika tidak ada migration.sql
      }

      // Cek apakah sudah diapply
      const { rows } = await client.query('SELECT id FROM "_prisma_migrations" WHERE migration_name = $1 AND finished_at IS NOT NULL', [migrationName]);

      if (rows.length > 0) {
        console.log(`⏭️  Skip (sudah diapply): ${migrationName}`);
        continue;
      }

      console.log(`⚡ Applying: ${migrationName}`);
      const id = crypto.randomUUID();
      await client.query('INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at) VALUES ($1, $2, $3, NOW())', [id, 'manual', migrationName]);

      await client.query(sqlFile);

      await client.query('UPDATE "_prisma_migrations" SET finished_at = NOW(), applied_steps_count = 1 WHERE id = $1', [id]);
      console.log(`✅ Applied: ${migrationName}`);
    }

    console.log('✅ Semua migration selesai!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('❌ Migration error:', e.message);
  process.exit(1);
});
