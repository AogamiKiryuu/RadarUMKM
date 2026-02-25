import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const { namaProduk, kategori, subKategori, hargaProduk, targetRating } = await readBody(event);

  // Find similar products
  const similarProducts = await prisma.product.findMany({
    where: {
      kategori: kategori,
      namaProduk: {
        contains: namaProduk.split(' ')[0],
        mode: 'insensitive',
      },
    },
    take: 20,
    orderBy: { jumlahTerjual: 'desc' },
  });

  // Calculate market averages
  const avgHargaKompetitor = similarProducts.length > 0 ? similarProducts.reduce((sum, p) => sum + p.hargaProduk, 0) / similarProducts.length : 0;

  const avgRatingKompetitor = similarProducts.length > 0 ? similarProducts.reduce((sum, p) => sum + p.rating, 0) / similarProducts.length : 0;

  // Generate comprehensive recommendations
  let recommendations = `# Analisis Rekomendasi Bisnis untuk "${namaProduk}"\n\n`;

  // 1. Price Strategy
  recommendations += `## 1. Strategi Penetapan Harga\n\n`;
  if (avgHargaKompetitor > 0) {
    const priceDiff = (((hargaProduk - avgHargaKompetitor) / avgHargaKompetitor) * 100).toFixed(1);
    if (hargaProduk > avgHargaKompetitor * 1.2) {
      recommendations += `⚠️ Harga Anda **${priceDiff}% lebih tinggi** dari rata-rata pasar (Rp ${Math.round(avgHargaKompetitor).toLocaleString('id-ID')}).\n\n`;
      recommendations += `**Rekomendasi:**\n`;
      recommendations += `- Pertimbangkan menurunkan harga ke kisaran Rp ${Math.round(avgHargaKompetitor * 1.1).toLocaleString('id-ID')} - Rp ${Math.round(avgHargaKompetitor * 1.15).toLocaleString('id-ID')}\n`;
      recommendations += `- Atau highlight value proposition yang membedakan produk Anda\n`;
      recommendations += `- Tawarkan bundle atau promo untuk meningkatkan perceived value\n\n`;
    } else if (hargaProduk < avgHargaKompetitor * 0.8) {
      recommendations += `✅ Harga Anda **${Math.abs(parseFloat(priceDiff))}% lebih rendah** dari rata-rata pasar.\n\n`;
      recommendations += `**Rekomendasi:**\n`;
      recommendations += `- Leverage competitive pricing dalam marketing\n`;
      recommendations += `- Pastikan margin masih menguntungkan\n`;
      recommendations += `- Fokus pada volume penjualan\n\n`;
    } else {
      recommendations += `✅ Harga Anda kompetitif dan sesuai dengan harga pasar.\n\n`;
    }
  }

  // 2. Quality & Rating Strategy
  recommendations += `## 2. Strategi Kualitas & Rating\n\n`;
  if (targetRating === 0) {
    recommendations += `⭐ Produk baru tanpa rating.\n\n`;
    recommendations += `**Rekomendasi:**\n`;
    recommendations += `- Tawarkan insentif untuk review pertama (cashback, voucher)\n`;
    recommendations += `- Pastikan kualitas produk excellent untuk mendapat rating tinggi\n`;
    recommendations += `- Follow up pembeli untuk feedback\n`;
    recommendations += `- Target minimal rating 4.5 dalam 3 bulan pertama\n\n`;
  } else if (targetRating < avgRatingKompetitor) {
    recommendations += `⚠️ Target rating Anda (${targetRating}) di bawah rata-rata pasar (${avgRatingKompetitor.toFixed(1)}).\n\n`;
    recommendations += `**Rekomendasi:**\n`;
    recommendations += `- Tingkatkan kualitas produk dan packaging\n`;
    recommendations += `- Respon cepat terhadap komplain pelanggan\n`;
    recommendations += `- Perbaiki deskripsi produk agar sesuai ekspektasi\n\n`;
  } else {
    recommendations += `✅ Target rating Anda baik (${targetRating}).\n\n`;
  }

  // 3. Market Competition
  recommendations += `## 3. Analisis Kompetisi\n\n`;
  recommendations += `Ditemukan **${similarProducts.length} produk kompetitor** dengan karakteristik serupa.\n\n`;

  if (similarProducts.length > 0) {
    const topCompetitor = similarProducts[0];
    recommendations += `**Top Competitor:**\n`;
    recommendations += `- Produk: ${topCompetitor.namaProduk}\n`;
    recommendations += `- Harga: Rp ${topCompetitor.hargaProduk.toLocaleString('id-ID')}\n`;
    recommendations += `- Rating: ${topCompetitor.rating} ⭐\n`;
    recommendations += `- Terjual: ${topCompetitor.jumlahTerjual} unit\n\n`;

    recommendations += `**Strategi Kompetisi:**\n`;
    recommendations += `- Analisis keunggulan produk top competitor\n`;
    recommendations += `- Identifikasi gap yang bisa Anda isi\n`;
    recommendations += `- Diferensiasi melalui unique value proposition\n\n`;
  }

  // 4. Marketing Recommendations
  recommendations += `## 4. Rekomendasi Marketing\n\n`;
  recommendations += `**Optimasi Listing:**\n`;
  recommendations += `- Gunakan foto produk berkualitas tinggi (min. 5 foto)\n`;
  recommendations += `- Tulis deskripsi detail dengan keyword SEO\n`;
  recommendations += `- Cantumkan spesifikasi lengkap produk\n`;
  recommendations += `- Highlight keunggulan dan unique selling points\n\n`;

  recommendations += `**Promosi:**\n`;
  recommendations += `- Manfaatkan flash sale untuk boost awal\n`;
  recommendations += `- Ikuti campaign toko (Harbolnas, 12.12, dll)\n`;
  recommendations += `- Tawarkan free shipping untuk meningkatkan konversi\n`;
  recommendations += `- Bundle dengan produk komplementer\n\n`;

  // 5. Target & KPI
  recommendations += `## 5. Target & KPI 3 Bulan Pertama\n\n`;
  recommendations += `📊 **Key Performance Indicators:**\n`;
  recommendations += `- Target penjualan: 50-100 unit/bulan\n`;
  recommendations += `- Target rating: ≥ 4.5 ⭐\n`;
  recommendations += `- Response rate: > 90%\n`;
  recommendations += `- Return rate: < 5%\n\n`;

  return {
    similarProducts: similarProducts.map((p) => ({
      nama_produk: p.namaProduk,
      nama_toko: p.namaToko,
      harga_produk: p.hargaProduk,
      rating: p.rating,
      jumlah_terjual: p.jumlahTerjual,
    })),
    avgHargaKompetitor: Math.round(avgHargaKompetitor),
    avgRatingKompetitor: Number(avgRatingKompetitor.toFixed(2)),
    recommendations,
  };
});
