import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const body = await readBody(event);

  const recommendation = await prisma.businessRecommendation.create({
    data: {
      userId: session.user.id,
      namaProduk: body.namaProduk,
      kategori: body.kategori,
      subKategori: body.subKategori,
      hargaProduk: body.hargaProduk,
      targetRating: body.targetRating,
      similarProducts: JSON.stringify(body.similarProducts || []),
      avgHargaKompetitor: body.avgHargaKompetitor,
      avgRatingKompetitor: body.avgRatingKompetitor,
      recommendations: body.recommendations,
    },
  });

  return {
    success: true,
    recommendation,
  };
});
