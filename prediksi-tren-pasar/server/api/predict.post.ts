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

  // Validation
  if (!namaProduk || !kategori || !hargaProduk || targetRating === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Data tidak lengkap',
    });
  }

  try {
    // Call Flask API for prediction
    const config = useRuntimeConfig();
    const flaskResponse = await $fetch(`${config.flaskApiUrl}/predict`, {
      method: 'POST',
      body: {
        nama_produk: namaProduk,
        kategori,
        sub_kategori: subKategori,
        harga_produk: hargaProduk,
        rating: targetRating,
      },
    });

    // Find similar products using simple text matching
    const similarProducts = await prisma.product.findMany({
      where: {
        kategori: kategori,
        namaProduk: {
          contains: namaProduk.split(' ')[0], // First word similarity
          mode: 'insensitive',
        },
      },
      take: 10,
      orderBy: { jumlahTerjual: 'desc' },
    });

    // Generate insight
    let insight = `Berdasarkan analisis machine learning:\n\n`;

    if (flaskResponse.prediction_label === 1) {
      insight += `✅ Produk Anda memiliki potensi BAIK di pasar dengan skor ${flaskResponse.prediction_score.toFixed(1)}%.\n\n`;
    } else {
      insight += `⚠️ Produk Anda memiliki potensi KURANG di pasar dengan skor ${flaskResponse.prediction_score.toFixed(1)}%.\n\n`;
    }

    // Price comparison
    if (similarProducts.length > 0) {
      const avgCompetitorPrice = similarProducts.reduce((sum, p) => sum + p.hargaProduk, 0) / similarProducts.length;
      if (hargaProduk > avgCompetitorPrice * 1.2) {
        insight += `💰 Harga Anda (Rp ${hargaProduk.toLocaleString('id-ID')}) lebih tinggi dari rata-rata kompetitor (Rp ${Math.round(avgCompetitorPrice).toLocaleString('id-ID')}). Pertimbangkan penyesuaian harga.\n\n`;
      } else if (hargaProduk < avgCompetitorPrice * 0.8) {
        insight += `💰 Harga Anda kompetitif! Lebih rendah dari rata-rata pasar.\n\n`;
      }
    }

    // Rating insight
    if (targetRating === 0) {
      insight += `⭐ Produk baru tanpa rating. Focus pada kualitas dan pelayanan untuk mendapatkan rating tinggi dari pembeli pertama.\n\n`;
    } else if (targetRating >= 4.5) {
      insight += `⭐ Target rating Anda sangat baik (${targetRating})! Ini akan meningkatkan kepercayaan pembeli.\n\n`;
    }

    return {
      predictionScore: flaskResponse.prediction_score,
      predictionLabel: flaskResponse.prediction_label,
      insight,
      similarProducts: similarProducts.map((p) => ({
        nama_produk: p.namaProduk,
        nama_toko: p.namaToko,
        harga_produk: p.hargaProduk,
        rating: p.rating,
        jumlah_terjual: p.jumlahTerjual,
      })),
    };
  } catch (error: any) {
    // If Flask API is not available, return mock data for development
    console.error('Flask API Error:', error);

    return {
      predictionScore: Math.random() * 100,
      predictionLabel: Math.random() > 0.5 ? 1 : 0,
      insight: `[DEMO MODE] Flask API tidak tersedia. Ini adalah data simulasi.\n\nProduk "${namaProduk}" dalam kategori ${kategori} dengan harga Rp ${hargaProduk.toLocaleString('id-ID')}.\n\nTarget rating: ${targetRating} bintang.`,
      similarProducts: [],
    };
  }
});
