// Server endpoint debug — HAPUS file ini setelah masalah teratasi!
export default defineEventHandler(() => {
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  
  return {
    hasDbUrl: !!dbUrl,
    hasDirectUrl: !!directUrl,
    // Tampilkan sebagian URL saja (aman, tidak expose password)
    dbUrlPreview: dbUrl ? dbUrl.substring(0, 40) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  };
});
