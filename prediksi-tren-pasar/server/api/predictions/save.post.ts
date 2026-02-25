import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const body = await readBody(event);

  const prediction = await prisma.prediction.create({
    data: {
      userId: session.user.id,
      namaProduk: body.namaProduk,
      kategori: body.kategori,
      subKategori: body.subKategori,
      hargaProduk: body.hargaProduk,
      targetRating: body.targetRating,
      predictionScore: body.predictionScore,
      predictionLabel: body.predictionLabel,
      insight: body.insight,
    },
  });

  return {
    success: true,
    prediction,
  };
});
