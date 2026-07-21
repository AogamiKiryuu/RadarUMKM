import { PrismaClient } from '../../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const createPrismaClient = () => {
  // Coba dari runtimeConfig Nuxt dulu, fallback ke process.env
  let connectionString: string | undefined;
  
  try {
    const config = useRuntimeConfig();
    connectionString = (config.databaseUrl as string) || process.env.DATABASE_URL;
  } catch {
    connectionString = process.env.DATABASE_URL;
  }

  if (!connectionString) {
    throw new Error('[Prisma] DATABASE_URL is not set. Check environment variables on Vercel.');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

// Singleton: hanya di dev mode agar tidak membuat koneksi berulang
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
