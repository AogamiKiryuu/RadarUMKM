/**
 * csv-dataset.ts
 * Singleton utility — membaca dataset_preprocessed.csv sekali saat startup
 * dan mengekspos berbagai agregasi untuk dashboard & API.
 */

import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

export interface ProductRow {
  url_produk: string;
  nama_produk: string;
  nama_produk_clean: string;
  kategori: string;
  sub_kategori: string;
  marketplace: string;
  lokasi: string;
  lokasi_clean: string;
  nama_toko: string;
  harga_produk: number;
  jumlah_terjual: number;
  rating: number;
  popularity_score: number;
}

let _cache: ProductRow[] | null = null;

export async function getProducts(): Promise<ProductRow[]> {
  if (_cache) return _cache;

  const csvPath = resolve(process.cwd(), 'data/processed/dataset_preprocessed.csv');
  const rows: ProductRow[] = [];

  await new Promise<void>((res, rej) => {
    const rl = createInterface({ input: createReadStream(csvPath) });
    let headers: string[] = [];
    let first = true;

    const parseCsvLine = (text: string) => {
      const vals: string[] = [];
      let inQuotes = false;
      let curr = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          vals.push(curr);
          curr = '';
        } else {
          curr += char;
        }
      }
      vals.push(curr);
      return vals;
    };

    rl.on('line', (line) => {
      if (!line.trim()) return;
      if (first) {
        headers = parseCsvLine(line);
        first = false;
        return;
      }

      const vals = parseCsvLine(line);
      const get = (col: string) => vals[headers.indexOf(col)] ?? '';

      rows.push({
        url_produk      : get('url_produk'),
        nama_produk     : get('nama_produk'),
        nama_produk_clean: get('nama_produk_clean'),
        kategori        : get('kategori'),
        sub_kategori    : get('sub_kategori'),
        marketplace     : get('marketplace'),
        lokasi          : get('lokasi'),
        lokasi_clean    : get('lokasi_clean'),
        nama_toko       : get('nama_toko'),
        harga_produk    : parseFloat(get('harga_produk')) || 0,
        jumlah_terjual  : parseFloat(get('jumlah_terjual')) || 0,
        rating          : parseFloat(get('rating')) || 0,
        popularity_score: parseFloat(get('popularity_score')) || 0,
      });
    });

    rl.on('close', () => res());
    rl.on('error', rej);
  });

  _cache = rows;
  console.log(`✅ CSV dataset loaded: ${rows.length} rows`);
  return rows;
}

// ─── Aggregation Helpers ──────────────────────────────────────────────────────

export async function getDashboardStats() {
  const products = await getProducts();
  const n = products.length;
  if (n === 0) return { totalProducts: 0, avgPrice: 0, avgRating: 0, totalSold: 0 };

  const avgPrice = products.reduce((s, p) => s + p.harga_produk, 0) / n;
  const avgRating = products.reduce((s, p) => s + p.rating, 0) / n;
  const totalSold = products.reduce((s, p) => s + p.jumlah_terjual, 0);

  return {
    totalProducts: n,
    avgPrice     : Math.round(avgPrice),
    avgRating    : parseFloat(avgRating.toFixed(2)),
    totalSold    : Math.round(totalSold),
  };
}

export async function getMarketplaceDistribution() {
  const products = await getProducts();
  const names = ['tokopedia', 'shopee', 'lazada'];
  const counts = names.map((mp) => ({
    name : mp.charAt(0).toUpperCase() + mp.slice(1),
    count: products.filter((p) => p.marketplace.toLowerCase() === mp).length,
  }));
  const matched = counts.reduce((s, c) => s + c.count, 0);
  if (products.length - matched > 0) counts.push({ name: 'Lainnya', count: products.length - matched });
  return counts;
}

export async function getCategoryDistribution() {
  const products = await getProducts();
  const map: Record<string, number> = {};
  for (const p of products) map[p.kategori] = (map[p.kategori] ?? 0) + 1;
  return Object.entries(map).map(([kategori, count]) => ({ kategori, count }));
}

export async function getCategoryTrend() {
  const products = await getProducts();
  const map: Record<string, { totalTerjual: number; jumlahProduk: number }> = {};
  for (const p of products) {
    if (!map[p.kategori]) map[p.kategori] = { totalTerjual: 0, jumlahProduk: 0 };
    map[p.kategori].totalTerjual += p.jumlah_terjual;
    map[p.kategori].jumlahProduk += 1;
  }
  return Object.entries(map)
    .map(([kategori, d]) => ({ kategori, ...d }))
    .sort((a, b) => b.totalTerjual - a.totalTerjual);
}

export async function getTopProductsByMarketplace(topN = 10) {
  const products = await getProducts();
  const result: Record<string, typeof products> = {};
  for (const mp of ['tokopedia', 'shopee', 'lazada']) {
    result[mp] = products
      .filter((p) => p.marketplace.toLowerCase() === mp)
      .sort((a, b) => b.jumlah_terjual - a.jumlah_terjual)
      .slice(0, topN);
  }
  return result;
}

export async function getTopProductsByLocation(topN = 10) {
  const products = await getProducts();
  const locations = ['Bogor', 'Jakarta', 'Bekasi', 'Depok', 'Tangerang', 'Lainnya'];
  const result: Record<string, typeof products> = {};

  // "Semua" = top produk dari seluruh dataset
  result['Semua'] = [...products]
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, topN);

  for (const loc of locations) {
    result[loc] = products
      .filter((p) => p.lokasi_clean === loc)
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, topN);
  }
  return result;
}

export async function getTopProductsByPopularity(topN = 10) {
  const products = await getProducts();
  return [...products].sort((a, b) => b.jumlah_terjual - a.jumlah_terjual).slice(0, topN);
}

export async function getTopRatedProducts(topN = 10) {
  const products = await getProducts();
  return [...products].filter((p) => p.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, topN);
}

export async function getPriceDistribution() {
  const products = await getProducts();
  const ranges = [
    { range: '0-50k', min: 0, max: 50000 },
    { range: '50-100k', min: 50000, max: 100000 },
    { range: '100-200k', min: 100000, max: 200000 },
    { range: '200k+', min: 200000, max: Infinity },
  ];
  return ranges.map(({ range, min, max }) => ({
    range,
    count: products.filter((p) => p.harga_produk >= min && p.harga_produk < max).length,
  }));
}

export async function getTopKeywords(topN = 15) {
  const products = await getProducts();
  const STOPWORDS = new Set([
    'dan','atau','yang','di','ke','dari','untuk','dengan','pada','adalah','ini','itu','juga','bisa',
    'khas','bogor','oleh','gr','kg','ml','pcs','isi','rasa','berat','ukuran','pack','paket','set',
    'produk','toko','item','new','1','2','3','4','5','10','100','500','1000','free','gratis',
    'original','asli','stok','ready','baru','murah','berkualitas','terbaik','best','top','premium',
    'kualitas','harga','promo','sale','diskon','special','limited','edition','pilihan',
  ]);
  const freq: Record<string, number> = {};
  for (const p of products) {
    const words = p.nama_produk
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([text, value]) => ({ text, value }));
}
