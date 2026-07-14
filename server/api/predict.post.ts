export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const { namaProduk, kategori, subKategori, hargaProduk } = await readBody(event);

  if (!namaProduk || !kategori || !hargaProduk) {
    throw createError({
      statusCode: 400,
      message: 'Data tidak lengkap. Pastikan nama produk, kategori, dan harga terisi.',
    });
  }

  const config = useRuntimeConfig();

  // ── Panggil Flask API v3 ───────────────────────────────────────────────────
  let flaskData: any;
  try {
    flaskData = await $fetch(`${config.flaskApiUrl}/predict`, {
      method: 'POST',
      timeout: 30000,
      body: {
        nama_produk  : namaProduk,
        kategori,
        sub_kategori : subKategori ?? '',
        harga_produk : hargaProduk,
      },
    });
  } catch (err: any) {
    const flaskBody = err?.data ?? err?.response?._data;
    if (flaskBody?.status === 'warning' || flaskBody?.status === 'error') {
      throw createError({ statusCode: 422, message: flaskBody.message as string });
    }
    console.error('⚠️  Flask API tidak dapat dihubungi:', err?.message ?? err);
    throw createError({
      statusCode: 503,
      message: `Flask API tidak dapat dihubungi di ${config.flaskApiUrl}. Pastikan server Flask sudah berjalan (python app.py).`,
    });
  }

  // ── Petakan response Flask v3 → front-end ──────────────────────────────────
  //
  // Flask v3 mengembalikan:
  //   { status, kesimpulan, peluang_laku_persen, alasan,
  //     konteks_harga, kompetitor[], produk_terpopuler, insight_pasar }
  //
  // kompetitor: { nama, harga, rating, terjual, marketplace, url_produk, kemiripan_persen }
  // produk_terpopuler: { label, deskripsi, produk[] }
  // insight_pasar: { narasi, kategori_terpopuler, sub_kategori_terpopuler,
  //                  posisi_kategori_anda, total_kategori,
  //                  ranking_semua_kategori[], top5_sub_kategori_global[],
  //                  sub_kategori_dalam_kategori_ini[] }

  const predictionScore: number = flaskData.peluang_laku_persen ?? 0;
  const predictionLabel: number = predictionScore >= 50 ? 1 : 0;
  const kesimpulan: string      = flaskData.kesimpulan ?? '';
  const alasan: string[]        = Array.isArray(flaskData.alasan) ? flaskData.alasan : [flaskData.alasan ?? ''];

  // Kompetitor
  const similarProducts = (flaskData.kompetitor ?? []).map((k: any) => ({
    nama_produk      : k.nama,
    nama_toko        : k.marketplace,
    url_produk       : k.url_produk,
    harga_produk     : k.harga,
    rating           : k.rating,
    jumlah_terjual   : k.terjual,
    kemiripan_persen : k.kemiripan_persen,
  }));

  // Konteks harga vs pasar (fitur baru v3)
  const konteksHarga = flaskData.konteks_harga
    ? {
        medianPasar   : flaskData.konteks_harga.median_pasar,
        rasioVsPasar  : flaskData.konteks_harga.rasio_vs_pasar,
        segmen        : flaskData.konteks_harga.segmen,        // "Murah" | "Menengah" | "Premium"
        selisihPersen : flaskData.konteks_harga.selisih_persen,
      }
    : null;

  // Produk paling digemari di kategori ini (fitur baru v3)
  const produkTerpopuler = flaskData.produk_terpopuler
    ? {
        label    : flaskData.produk_terpopuler.label,
        deskripsi: flaskData.produk_terpopuler.deskripsi,
        produk   : (flaskData.produk_terpopuler.produk ?? []).map((p: any) => ({
          nama           : p.nama,
          kategori       : p.kategori,
          subKategori    : p.sub_kategori,
          harga          : p.harga,
          jumlahTerjual  : p.jumlah_terjual,
          rating         : p.rating,
          popularityScore: p.popularity_score,
          marketplace    : p.marketplace,
          urlProduk      : p.url_produk,
          namaToko       : p.nama_toko,
        })),
      }
    : null;

  // Insight pasar keseluruhan (fitur baru v3)
  const insightPasar = flaskData.insight_pasar
    ? {
        narasi                     : flaskData.insight_pasar.narasi,
        kategoriTerpopuler         : flaskData.insight_pasar.kategori_terpopuler,
        subKategoriTerpopuler      : flaskData.insight_pasar.sub_kategori_terpopuler,
        posisiKategoriAnda         : flaskData.insight_pasar.posisi_kategori_anda,
        totalKategori              : flaskData.insight_pasar.total_kategori,
        rankingSemua               : flaskData.insight_pasar.ranking_semua_kategori ?? [],
        top5SubKategoriGlobal      : flaskData.insight_pasar.top5_sub_kategori_global ?? [],
        subKategoriDalamKategoriIni: flaskData.insight_pasar.sub_kategori_dalam_kategori_ini ?? [],
      }
    : null;

  return {
    predictionScore,
    predictionLabel,
    kesimpulan,
    alasan,
    similarProducts,
    konteksHarga,
    produkTerpopuler,
    insightPasar,
  };
});
