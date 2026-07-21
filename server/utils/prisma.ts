import pg from 'pg';
import { PrismaClient } from '../../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('[Prisma] DATABASE_URL is not set. Check environment variables.');
  }

  // Buat pg.Pool secara eksplisit dengan SSL config
  // Diperlukan agar Vercel serverless bisa konek ke Supabase dengan benar
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  const pool = new pg.Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var __prisma: undefined | ReturnType<typeof createPrismaClient>;
}

const prisma = (process.env.NODE_ENV !== 'production' && globalThis.__prisma)
  ? globalThis.__prisma
  : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
