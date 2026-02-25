import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Get stats
  const totalProducts = await prisma.product.count();

  const products = await prisma.product.findMany();

  const avgPrice = products.reduce((sum, p) => sum + p.hargaProduk, 0) / totalProducts || 0;
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts || 0;
  const totalSold = products.reduce((sum, p) => sum + p.jumlahTerjual, 0);

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

  return {
    stats: {
      totalProducts,
      avgPrice: Math.round(avgPrice),
      avgRating: Number(avgRating.toFixed(2)),
      totalSold,
    },
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
    },
  };
});
