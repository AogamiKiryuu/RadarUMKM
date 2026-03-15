export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const { namaProduk, kategori, subKategori, hargaProduk } = await readBody(event);

  // Validation
  if (!namaProduk || !kategori || !hargaProduk) {
    throw createError({
      statusCode: 400,
      message: 'Data tidak lengkap. Pastikan nama produk, kategori, dan harga terisi.',
    });
  }

  const config = useRuntimeConfig();

  // ── Panggil Flask API ──────────────────────────────────────────────────────
  let flaskData: any;
  try {
    flaskData = await $fetch(`${config.flaskApiUrl}/predict`, {
      method: 'POST',
      body: {
        nama_produk: namaProduk,
        kategori,
        sub_kategori: subKategori ?? '',
        harga_produk: hargaProduk,
      },
    });
  } catch (err: any) {
    // Flask mengembalikan HTTP 400 untuk status "error" dan "warning"
    const flaskBody = err?.data ?? err?.response?._data;
    if (flaskBody?.status === 'warning' || flaskBody?.status === 'error') {
      throw createError({
        statusCode: 422,
        message: flaskBody.message as string,
      });
    }

    // Flask tidak bisa dihubungi sama sekali
    console.error('⚠️  Flask API tidak dapat dihubungi:', err?.message ?? err);
    throw createError({
      statusCode: 503,
      message: `Flask API tidak dapat dihubungi di ${config.flaskApiUrl}. Pastikan server Flask sudah berjalan (python app.py).`,
    });
  }

  // ── Petakan response Flask → format yang dipakai front-end ─────────────────
  //
  // Flask mengembalikan:
  //   { status, kesimpulan, peluang_laku_persen, alasan, kompetitor[] }
  //
  // Kompetitor Flask:
  //   { nama, harga, rating, terjual, marketplace, url_produk, kemiripan_persen }
  //
  // Front-end (prediksi.vue) mengharapkan:
  //   { predictionScore, predictionLabel, insight, similarProducts[], kesimpulan, alasan }

  const predictionScore: number = flaskData.peluang_laku_persen ?? 0;
  const predictionLabel: number = predictionScore >= 50 ? 1 : 0;
  const kesimpulan: string = flaskData.kesimpulan ?? '';
  // Flask sekarang mengembalikan alasan sebagai array of string
  const alasan: string[] = Array.isArray(flaskData.alasan)
    ? flaskData.alasan
    : [flaskData.alasan ?? ''];

  const similarProducts = (flaskData.kompetitor ?? []).map((k: any) => ({
    nama_produk: k.nama,
    nama_toko: k.marketplace,
    url_produk: k.url_produk,
    harga_produk: k.harga,
    rating: k.rating,
    jumlah_terjual: k.terjual,
    kemiripan_persen: k.kemiripan_persen,
  }));

  return {
    predictionScore,
    predictionLabel,
    kesimpulan,
    alasan,
    similarProducts,
  };
});
