import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const { namaProduk, kategori, subKategori, hargaProduk, targetRating } = await readBody(event);

  // 1. Find competitor products in same category
  const competitors = await prisma.product.findMany({
    where: { kategori },
    orderBy: { jumlahTerjual: 'desc' },
    take: 50,
  });

  // 2. Closer competitors by sub-category
  const closeCompetitors = subKategori
    ? competitors.filter((p) => p.subKategori === subKategori).slice(0, 20)
    : competitors.slice(0, 20);

  const pool = closeCompetitors.length >= 5 ? closeCompetitors : competitors.slice(0, 20);

  // 3. Market metrics
  const avgHarga = pool.length
    ? Math.round(pool.reduce((s, p) => s + p.hargaProduk, 0) / pool.length)
    : hargaProduk;
  const avgRating = pool.length
    ? Number((pool.reduce((s, p) => s + p.rating, 0) / pool.length).toFixed(2))
    : 0;
  const avgTerjual = pool.length
    ? Math.round(pool.reduce((s, p) => s + p.jumlahTerjual, 0) / pool.length)
    : 0;
  const topSeller = pool[0] ?? null;
  const priceMin = pool.length ? Math.min(...pool.map((p) => p.hargaProduk)) : 0;
  const priceMax = pool.length ? Math.max(...pool.map((p) => p.hargaProduk)) : 0;

  // 4. Price analysis
  const priceDiffPct = avgHarga > 0 ? ((hargaProduk - avgHarga) / avgHarga) * 100 : 0;
  let priceStatus: 'ok' | 'warning' | 'danger';
  let priceHeadline: string;
  let priceActions: string[];
  if (priceDiffPct > 25) {
    priceStatus = 'danger';
    priceHeadline = `Harga Anda ${priceDiffPct.toFixed(0)}% lebih mahal dari rata-rata pasar`;
    priceActions = [
      `Pertimbangkan harga di kisaran Rp ${Math.round(avgHarga * 1.05).toLocaleString('id-ID')} – Rp ${Math.round(avgHarga * 1.15).toLocaleString('id-ID')}`,
      'Tampilkan keunggulan produk yang justifikasi harga premium',
      'Tawarkan bundle/paket untuk meningkatkan perceived value',
      'Coba harga penetrasi di bulan pertama untuk bangun reputasi',
    ];
  } else if (priceDiffPct < -20) {
    priceStatus = 'warning';
    priceHeadline = `Harga Anda ${Math.abs(priceDiffPct).toFixed(0)}% lebih murah dari rata-rata pasar`;
    priceActions = [
      'Leverage harga kompetitif sebagai keunggulan di marketing',
      'Pastikan margin masih menguntungkan di harga ini',
      'Pertimbangkan menaikkan harga bertahap setelah rating membaik',
      'Fokus volume penjualan tinggi untuk kompensasi margin rendah',
    ];
  } else {
    priceStatus = 'ok';
    priceHeadline = 'Harga Anda sudah kompetitif dan sesuai pasar';
    priceActions = [
      'Pertahankan harga dan fokus pada peningkatan kualitas',
      'Manfaatkan momen promo (Harbolnas, 12.12) untuk flash sale ringan',
      'Coba harga sedikit lebih tinggi (+5-10%) jika kualitas premium',
    ];
  }

  // 5. Rating analysis
  const ratingDiff = targetRating - avgRating;
  let ratingStatus: 'ok' | 'warning' | 'danger';
  let ratingHeadline: string;
  let ratingActions: string[];
  if (targetRating === 0) {
    ratingStatus = 'warning';
    ratingHeadline = 'Produk belum memiliki rating — fokus pada kesan pertama pembeli';
    ratingActions = [
      'Tawarkan insentif ulasan (cashback/voucher) untuk pembeli pertama',
      'Follow up pembeli 2-3 hari setelah pengiriman untuk minta review',
      'Pastikan packaging rapi agar kesan pertama sangat positif',
      `Target minimal rating ${(avgRating + 0.3).toFixed(1)} dalam 30 hari pertama`,
    ];
  } else if (ratingDiff < -0.3) {
    ratingStatus = 'danger';
    ratingHeadline = `Target rating Anda (${targetRating}) di bawah rata-rata pasar (${avgRating.toFixed(1)})`;
    ratingActions = [
      'Prioritaskan peningkatan kualitas produk sebelum launch skala besar',
      'Perbaiki deskripsi agar ekspektasi pembeli sesuai produk nyata',
      'Respon komplain dalam < 2 jam untuk menjaga kepuasan',
      `Naikkan target ke minimal ${avgRating.toFixed(1)} agar bersaing`,
    ];
  } else {
    ratingStatus = 'ok';
    ratingHeadline = `Target rating (${targetRating}) kompetitif dan di atas rata-rata pasar`;
    ratingActions = [
      'Pertahankan kualitas — jangan turunkan standar saat volume naik',
      'Respond ulasan negatif secara profesional dan tawarkan solusi',
      'Gunakan rating tinggi sebagai social proof di foto & deskripsi produk',
    ];
  }

  // 6. Competition analysis
  const totalKompetitor = competitors.length;
  let competitionStatus: 'ok' | 'warning' | 'danger';
  let competitionHeadline: string;
  let competitionActions: string[];
  if (totalKompetitor > 30) {
    competitionStatus = 'danger';
    competitionHeadline = `Pasar ${kategori} sangat ramai — ${totalKompetitor} produk kompetitor`;
    competitionActions = [
      'Diferensiasi wajib: berikan ciri khas yang mudah diingat pembeli',
      `Bidik sub-niche lebih spesifik (contoh: ${subKategori || 'varian unik lokal Bogor'})`,
      'Investasi pada foto produk profesional dan copywriting yang standout',
      'Bangun brand identity melalui konsistensi packaging & cerita produk',
    ];
  } else if (totalKompetitor > 10) {
    competitionStatus = 'warning';
    competitionHeadline = `Kompetisi moderat — ${totalKompetitor} produk di kategori ${kategori}`;
    competitionActions = [
      'Ada ruang untuk masuk, tapi butuh keunggulan yang jelas',
      'Analisis 3 top seller dan identifikasi gap yang bisa Anda isi',
      'Fokus pada segmen pembeli yang belum terlayani dengan baik',
    ];
  } else {
    competitionStatus = 'ok';
    competitionHeadline = `Pasar terbuka — hanya ${totalKompetitor} kompetitor di kategori ini`;
    competitionActions = [
      'Peluang besar untuk menjadi pemain dominan di kategori ini',
      'Bangun brand awareness sejak dini untuk first-mover advantage',
      'Eksplorasi apakah ada demand yang belum terpenuhi di segmen ini',
    ];
  }

  // 7. Marketing strategy
  const marketingActions = [
    'Gunakan minimal 5 foto produk berkualitas tinggi + 1 video singkat',
    'Tulis deskripsi detail dengan keyword SEO yang relevan',
    'Cantumkan spesifikasi lengkap: berat, ukuran, bahan, expired (jika makanan)',
    'Daftarkan ke fitur "Gratis Ongkir" — sangat meningkatkan konversi',
    'Manfaatkan flash sale di jam aktif: 12.00 dan 19.00–21.00',
    'Ikuti campaign marketplace (Harbolnas, 9.9, 12.12) untuk boost penjualan',
  ];

  // 8. KPIs
  const targetBulananTerjual = Math.max(50, Math.round(avgTerjual * 0.3));
  const kpis = [
    { metric: 'Target Penjualan', target: `${targetBulananTerjual}–${targetBulananTerjual * 2} unit/bulan`, icon: 'i-heroicons-shopping-bag', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { metric: 'Target Rating', target: `≥ ${Math.max(targetRating, avgRating).toFixed(1)} ⭐`, icon: 'i-heroicons-star', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { metric: 'Response Rate', target: '> 90%', icon: 'i-heroicons-chat-bubble-left-right', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { metric: 'Return Rate', target: '< 5%', icon: 'i-heroicons-arrow-uturn-left', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  ];

  // 9. Overall opportunity score (0-100)
  let score = 50;
  if (priceStatus === 'ok') score += 15; else if (priceStatus === 'warning') score += 5;
  if (ratingStatus === 'ok') score += 20; else if (ratingStatus === 'warning') score += 5;
  if (competitionStatus === 'ok') score += 15; else if (competitionStatus === 'warning') score += 7;
  const scoreLabel = score >= 75 ? 'Peluang Tinggi' : score >= 55 ? 'Peluang Moderat' : 'Perlu Persiapan Lebih';

  return {
    score,
    scoreLabel,
    avgHargaKompetitor: avgHarga,
    avgRatingKompetitor: avgRating,
    avgTerjualKompetitor: avgTerjual,
    priceRange: { min: priceMin, max: priceMax },
    strategies: [
      { id: 'harga', title: 'Strategi Harga', icon: 'i-heroicons-banknotes', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', status: priceStatus, headline: priceHeadline, actions: priceActions },
      { id: 'rating', title: 'Kualitas & Rating', icon: 'i-heroicons-star', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', status: ratingStatus, headline: ratingHeadline, actions: ratingActions },
      { id: 'kompetisi', title: 'Analisis Kompetisi', icon: 'i-heroicons-users', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', status: competitionStatus, headline: competitionHeadline, actions: competitionActions },
      { id: 'marketing', title: 'Strategi Marketing', icon: 'i-heroicons-megaphone', color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20', status: 'ok' as const, headline: 'Langkah marketing untuk memenangkan perhatian pembeli', actions: marketingActions },
    ],
    kpis,
    topSeller: topSeller ? { nama_produk: topSeller.namaProduk, nama_toko: topSeller.namaToko, harga_produk: topSeller.hargaProduk, rating: topSeller.rating, jumlah_terjual: topSeller.jumlahTerjual, url: topSeller.url } : null,
    similarProducts: pool.slice(0, 10).map((p) => ({ nama_produk: p.namaProduk, nama_toko: p.namaToko, harga_produk: p.hargaProduk, rating: p.rating, jumlah_terjual: p.jumlahTerjual, url: p.url })),
  };
});
