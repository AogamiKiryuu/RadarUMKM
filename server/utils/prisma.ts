import { PrismaClient } from '../../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('[Prisma] DATABASE_URL is not set. Check environment variables.');
  }

  const adapter = new PrismaPg({ connectionString });
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
