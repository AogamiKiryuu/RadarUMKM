import {
  getDashboardStats,
  getMarketplaceDistribution,
  getCategoryDistribution,
  getCategoryTrend,
  getTopProductsByMarketplace,
  getTopProductsByLocation,
  getTopProductsByPopularity,
  getTopRatedProducts,
  getPriceDistribution,
  getTopKeywords,
} from '../../utils/csv-dataset';

export default defineEventHandler(async (_event) => {
  const [
    stats,
    marketplaceCounts,
    categoryCount,
    categoryTrendData,
    topProductsByMarketplace,
    topProductsByLocation,
    topProducts,
    topRated,
    priceDistribution,
    topKeywords,
  ] = await Promise.all([
    getDashboardStats(),
    getMarketplaceDistribution(),
    getCategoryDistribution(),
    getCategoryTrend(),
    getTopProductsByMarketplace(10),
    getTopProductsByLocation(10),
    getTopProductsByPopularity(10),
    getTopRatedProducts(10),
    getPriceDistribution(),
    getTopKeywords(15),
  ]);

  const mpColors = ['rgba(0, 177, 79, 0.75)', 'rgba(238, 77, 45, 0.75)', 'rgba(0, 100, 220, 0.75)', 'rgba(156, 163, 175, 0.75)'];

  return {
    stats,
    topKeywords,
    marketplaceDistribution: marketplaceCounts,
    topProductsByMarketplace,
    topProductsByLocation,
    categoryTrend: categoryTrendData,
    charts: {
      topProducts: {
        labels  : topProducts.map((p) => p.nama_produk.substring(0, 30)),
        datasets: [{
          label          : 'Jumlah Terjual',
          data           : topProducts.map((p) => p.jumlah_terjual),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor    : 'rgb(59, 130, 246)',
          borderWidth    : 1,
        }],
      },
      topRated: {
        labels  : topRated.map((p) => p.nama_produk.substring(0, 30)),
        datasets: [{
          label          : 'Rating',
          data           : topRated.map((p) => p.rating),
          backgroundColor: 'rgba(234, 179, 8, 0.5)',
          borderColor    : 'rgb(234, 179, 8)',
          borderWidth    : 1,
        }],
      },
      categories: {
        labels  : categoryCount.map((c) => c.kategori),
        datasets: [{
          data           : categoryCount.map((c) => c.count),
          backgroundColor: ['rgba(239, 68, 68, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(34, 197, 94, 0.5)', 'rgba(234, 179, 8, 0.5)', 'rgba(168, 85, 247, 0.5)'],
        }],
      },
      priceDistribution: {
        labels  : priceDistribution.map((p) => p.range),
        datasets: [{
          label          : 'Jumlah Produk',
          data           : priceDistribution.map((p) => p.count),
          borderColor    : 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension        : 0.1,
        }],
      },
      marketplace: {
        labels  : marketplaceCounts.map((m) => m.name),
        datasets: [{
          data           : marketplaceCounts.map((m) => m.count),
          backgroundColor: mpColors,
          borderWidth    : 2,
          borderColor    : '#fff',
        }],
      },
      topKeywords: {
        labels  : topKeywords.map((k) => k.text),
        datasets: [{
          label          : 'Frekuensi',
          data           : topKeywords.map((k) => k.value),
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor    : 'rgb(139, 92, 246)',
          borderWidth    : 1,
          borderRadius   : 6,
        }],
      },
    },
  };
});
