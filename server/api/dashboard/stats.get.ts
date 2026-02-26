import prisma from '../../utils/prisma';

// Stopwords bahasa Indonesia + umum yang tidak informatif
const STOPWORDS = new Set([
  'dan','atau','yang','di','ke','dari','untuk','dengan','pada','adalah','ini','itu','juga','bisa',
  'khas','bogor','oleh','gr','kg','ml','pcs','isi','rasa','berat','ukuran','pack','paket','set',
  'produk','toko','item','new','1','2','3','4','5','10','100','500','1000','free','gratis',
  'original','asli','stok','ready','baru','murah','berkualitas','terbaik','best','top','premium',
  'kualitas','harga','promo','sale','diskon','special','limited','edition','pilihan',
]);

function extractKeywords(names: string[]): { text: string; value: number }[] {
  const freq: Record<string, number> = {};
  for (const name of names) {
    const words = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    for (const w of words) {
      freq[w] = (freq[w] ?? 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 60)
    .map(([text, value]) => ({ text, value }));
}

export default defineEventHandler(async (event) => {
  // Get stats
  const totalProducts = await prisma.product.count();

  const products = await prisma.product.findMany();

  const avgPrice = products.reduce((sum, p) => sum + p.hargaProduk, 0) / totalProducts || 0;
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts || 0;
  const totalSold = products.reduce((sum, p) => sum + p.jumlahTerjual, 0);

  // ── Marketplace distribution (derived from URL) ──────────────────────────
  const marketplaceNames = ['tokopedia', 'shopee', 'lazada'];
  const marketplaceCounts = await Promise.all(
    marketplaceNames.map(async (mp) => {
      const count = await prisma.product.count({
        where: { url: { contains: mp, mode: 'insensitive' } },
      });
      return { name: mp.charAt(0).toUpperCase() + mp.slice(1), count };
    }),
  );
  // Products with no matched URL fall into 'Lainnya'
  const matchedCount = marketplaceCounts.reduce((s, m) => s + m.count, 0);
  if (totalProducts - matchedCount > 0) {
    marketplaceCounts.push({ name: 'Lainnya', count: totalProducts - matchedCount });
  }

  // ── Top Keywords from product names ─────────────────────────────────────
  const allNames = products.map((p) => p.namaProduk);
  const keywords = extractKeywords(allNames);
  const topKeywords = keywords.slice(0, 15);

  // Get top products by sales
  const topProducts = await prisma.product.findMany({
    orderBy: { jumlahTerjual: 'desc' },
    take: 10,
  });

  // Get top rated products
  const topRated = await prisma.product.findMany({
    where: { rating: { gt: 0 } },
    orderBy: { rating: 'desc' },
    take: 10,
  });

  // Category distribution
  const categoryCount = await prisma.product.groupBy({
    by: ['kategori'],
    _count: true,
  });

  // Price distribution (simplified)
  const priceRanges = [
    { range: '0-50k', min: 0, max: 50000 },
    { range: '50-100k', min: 50000, max: 100000 },
    { range: '100-200k', min: 100000, max: 200000 },
    { range: '200k+', min: 200000, max: 999999999 },
  ];

  const priceDistribution = await Promise.all(
    priceRanges.map(async ({ range, min, max }) => {
      const count = await prisma.product.count({
        where: {
          hargaProduk: { gte: min, lt: max },
        },
      });
      return { range, count };
    }),
  );

  // ── Top Products per Marketplace ────────────────────────────────────────
  const topProductsByMarketplace: Record<string, object[]> = {};
  for (const mp of ['tokopedia', 'shopee', 'lazada']) {
    topProductsByMarketplace[mp] = await prisma.product.findMany({
      where: { url: { contains: mp, mode: 'insensitive' } },
      orderBy: { jumlahTerjual: 'desc' },
      take: 10,
      select: {
        namaProduk: true,
        hargaProduk: true,
        rating: true,
        jumlahTerjual: true,
        namaToko: true,
        url: true,
        kategori: true,
        subKategori: true,
      },
    });
  }

  return {
    stats: {
      totalProducts,
      avgPrice: Math.round(avgPrice),
      avgRating: Number(avgRating.toFixed(2)),
      totalSold,
    },
    keywords,
    topKeywords,
    marketplaceDistribution: marketplaceCounts,
    topProductsByMarketplace,
    charts: {
      topProducts: {
        labels: topProducts.map((p) => p.namaProduk.substring(0, 30)),
        datasets: [
          {
            label: 'Jumlah Terjual',
            data: topProducts.map((p) => p.jumlahTerjual),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
        ],
      },
      topRated: {
        labels: topRated.map((p) => p.namaProduk.substring(0, 30)),
        datasets: [
          {
            label: 'Rating',
            data: topRated.map((p) => p.rating),
            backgroundColor: 'rgba(234, 179, 8, 0.5)',
            borderColor: 'rgb(234, 179, 8)',
            borderWidth: 1,
          },
        ],
      },
      categories: {
        labels: categoryCount.map((c) => c.kategori),
        datasets: [
          {
            data: categoryCount.map((c) => c._count),
            backgroundColor: ['rgba(239, 68, 68, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(34, 197, 94, 0.5)', 'rgba(234, 179, 8, 0.5)', 'rgba(168, 85, 247, 0.5)'],
          },
        ],
      },
      priceDistribution: {
        labels: priceDistribution.map((p) => p.range),
        datasets: [
          {
            label: 'Jumlah Produk',
            data: priceDistribution.map((p) => p.count),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.1,
          },
        ],
      },
      marketplace: {
        labels: marketplaceCounts.map((m) => m.name),
        datasets: [
          {
            data: marketplaceCounts.map((m) => m.count),
            backgroundColor: [
              'rgba(0, 177, 79, 0.75)',   // Tokopedia green
              'rgba(238, 77, 45, 0.75)',  // Shopee orange-red
              'rgba(0, 100, 220, 0.75)',  // Lazada blue
              'rgba(156, 163, 175, 0.75)', // Lainnya gray
            ],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      topKeywords: {
        labels: topKeywords.map((k) => k.text),
        datasets: [
          {
            label: 'Frekuensi',
            data: topKeywords.map((k) => k.value),
            backgroundColor: 'rgba(139, 92, 246, 0.6)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
    },
  };
});

