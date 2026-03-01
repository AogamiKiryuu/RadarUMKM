<template>
  <NuxtLayout name="default">
    <template #topbar>
      <div>
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Rekomendasi</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Analisis strategi bisnis berbasis data</p>
      </div>
    </template>

    <div class="p-5 sm:p-7">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Analisis Rekomendasi Bisnis</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Dapatkan insight dan strategi berbasis data pasar nyata untuk produk UMKM Anda.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Form Input -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div class="p-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <UIcon name="i-heroicons-pencil-square" class="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Data Produk</h3>
            </div>
            <form @submit.prevent="handleAnalisis" class="p-5 space-y-4">
              <!-- Banner dari prediksi -->
              <div v-if="fromPrediksi" class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4 text-emerald-600 shrink-0" />
                <p class="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Data diisi otomatis dari hasil prediksi</p>
              </div>
              <UFormField label="Nama Produk">
                <UInput v-model="form.namaProduk" placeholder="contoh: Lapis Talas Bogor" icon="i-heroicons-tag" class="w-full" />
              </UFormField>
              <UFormField label="Kategori">
                <USelect v-model="form.kategori" :items="kategoris" placeholder="Pilih kategori..." class="w-full" />
              </UFormField>
              <UFormField label="Sub Kategori">
                <USelect v-model="form.subKategori" :items="subKategoris" placeholder="Pilih sub kategori..." :disabled="!form.kategori" class="w-full" />
              </UFormField>
              <UFormField label="Harga Produk (Rp)">
                <UInput v-model.number="form.hargaProduk" type="number" placeholder="50000" icon="i-heroicons-banknotes" class="w-full" />
              </UFormField>
              <UFormField label="Target Rating (0-5)">
                <UInput v-model.number="form.targetRating" type="number" step="0.1" min="0" max="5" placeholder="4.5" icon="i-heroicons-star" class="w-full" />
              </UFormField>
              <UButton type="submit" block :loading="loading" color="primary" size="lg" class="!mt-5 font-semibold">
                <template #leading><UIcon name="i-heroicons-light-bulb" /></template>
                Analisis Sekarang
              </UButton>
            </form>
          </div>
        </div>

        <!-- Results Panel -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Empty State -->
          <div
            v-if="!result && !loading"
            class="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-24 text-center"
          >
            <div class="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-light-bulb" class="w-7 h-7 text-gray-300 dark:text-gray-600" />
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-semibold text-sm">Belum ada rekomendasi</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Isi form dan tekan "Analisis Sekarang"</p>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="loading" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse space-y-4">
            <div class="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div class="grid grid-cols-2 gap-3">
              <div class="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              <div class="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            </div>
            <div class="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          </div>

          <template v-if="result && !loading">
            <!-- Score Banner -->
            <div :class="scoreBannerClass" class="rounded-2xl p-5 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold opacity-80 uppercase tracking-wider mb-1">Skor Peluang Bisnis</p>
                  <p class="text-4xl font-black">{{ result.score }}<span class="text-xl font-semibold opacity-70">/100</span></p>
                  <p class="text-sm font-semibold mt-1 opacity-90">{{ result.scoreLabel }}</p>
                </div>
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <UIcon :name="scoreIcon" class="w-8 h-8" />
                </div>
              </div>
            </div>

            <!-- Market Comparison -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <UIcon name="i-heroicons-scale" class="w-3.5 h-3.5 text-blue-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Perbandingan dengan Pasar</h3>
              </div>
              <div class="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Harga Anda</p>
                  <p class="text-sm font-bold text-blue-700 dark:text-blue-300">Rp {{ formatNumber(form.hargaProduk) }}</p>
                </div>
                <div class="text-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Avg Pasar</p>
                  <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300">Rp {{ formatNumber(result.avgHargaKompetitor || 0) }}</p>
                </div>
                <div class="text-center p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Target Rating</p>
                  <p class="text-sm font-bold text-amber-700 dark:text-amber-300">{{ form.targetRating }} ⭐</p>
                </div>
                <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Rating Pasar</p>
                  <p class="text-sm font-bold text-purple-700 dark:text-purple-300">{{ result.avgRatingKompetitor?.toFixed(1) || '—' }} ⭐</p>
                </div>
              </div>
            </div>

            <!-- Strategy Cards -->
            <div class="space-y-3">
              <div
                v-for="strategy in result.strategies"
                :key="strategy.id"
                class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div class="px-5 py-4 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div :class="strategy.color" class="p-2 rounded-xl">
                      <UIcon :name="strategy.icon" class="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ strategy.title }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ strategy.headline }}</p>
                    </div>
                  </div>
                  <span :class="statusBadgeClass(strategy.status)" class="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {{ statusLabel(strategy.status) }}
                  </span>
                </div>
                <div class="px-5 pb-4">
                  <ul class="space-y-1.5">
                    <li v-for="(action, i) in strategy.actions" :key="i" class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <UIcon name="i-heroicons-arrow-right-circle" class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                      {{ action }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- KPI Targets -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <UIcon name="i-heroicons-chart-bar" class="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Target KPI Bulanan</h3>
              </div>
              <div class="p-5 grid grid-cols-2 gap-3">
                <div v-for="kpi in result.kpis" :key="kpi.metric" :class="kpi.color" class="p-4 rounded-xl">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon :name="kpi.icon" class="w-4 h-4" />
                    <span class="text-xs font-semibold">{{ kpi.metric }}</span>
                  </div>
                  <p class="text-sm font-bold">{{ kpi.target }}</p>
                </div>
              </div>
            </div>

            <!-- Top Seller Highlight -->
            <div v-if="result.topSeller" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <UIcon name="i-heroicons-trophy" class="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Top Seller Kompetitor</h3>
              </div>
              <div class="p-5 flex items-start gap-4">
                <div class="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center shrink-0">
                  <UIcon name="i-heroicons-star" class="w-5 h-5 text-amber-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <a v-if="result.topSeller.url && result.topSeller.url !== 'nan'" :href="result.topSeller.url" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline line-clamp-2">
                    {{ result.topSeller.nama_produk }}
                  </a>
                  <p v-else class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{{ result.topSeller.nama_produk }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ result.topSeller.nama_toko }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-xs font-bold text-gray-800 dark:text-gray-200">Rp {{ formatNumber(result.topSeller.harga_produk) }}</span>
                    <span class="text-xs text-amber-500">{{ result.topSeller.rating }} ⭐</span>
                    <span class="text-xs text-gray-500">{{ formatNumber(result.topSeller.jumlah_terjual) }} terjual</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Similar Products Table -->
            <div v-if="result.similarProducts && result.similarProducts.length > 0" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <UIcon name="i-heroicons-users" class="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Produk Kompetitor Serupa</h3>
                </div>
                <span class="text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">{{ result.similarProducts.length }} produk</span>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="bg-gray-50 dark:bg-gray-800/50">
                      <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produk</th>
                      <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Toko</th>
                      <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Harga</th>
                      <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                      <th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Terjual</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="(product, idx) in result.similarProducts" :key="idx" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td class="px-5 py-3 max-w-[200px]">
                        <a v-if="product.url && product.url !== 'nan'" :href="product.url" target="_blank" rel="noopener noreferrer" class="text-emerald-700 dark:text-emerald-400 hover:underline line-clamp-2 font-medium">{{ product.nama_produk }}</a>
                        <span v-else class="line-clamp-2 text-gray-800 dark:text-gray-200 font-medium">{{ product.nama_produk }}</span>
                      </td>
                      <td class="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{{ product.nama_toko }}</td>
                      <td class="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">Rp {{ formatNumber(product.harga_produk) }}</td>
                      <td class="px-5 py-3 text-right text-amber-500 font-medium">{{ product.rating }} ⭐</td>
                      <td class="px-5 py-3 text-right text-gray-500 dark:text-gray-400">{{ formatNumber(product.jumlah_terjual) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3">
              <UButton @click="downloadPDF" color="primary" icon="i-heroicons-arrow-down-tray" class="font-semibold">Download PDF</UButton>
              <UButton @click="resetForm" variant="soft" color="neutral" icon="i-heroicons-arrow-path" class="font-semibold">Analisis Baru</UButton>
            </div>
          </template>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const toast = useToast();

const loading = ref(false);
const form = ref({ namaProduk: '', kategori: '', subKategori: '', hargaProduk: 0, targetRating: 4.5 });
const result = ref<any>(null);
const fromPrediksi = ref(false);

onMounted(async () => {
  try {
    const stored = sessionStorage.getItem('rekomendasiFromPrediksi');
    if (stored) {
      const data = JSON.parse(stored);
      form.value = { namaProduk: data.namaProduk || '', kategori: data.kategori || '', subKategori: '', hargaProduk: data.hargaProduk || 0, targetRating: data.targetRating ?? 4.5 };
      sessionStorage.removeItem('rekomendasiFromPrediksi');
      await nextTick(); // tunggu watch kategori selesai clear subKategori
      form.value.subKategori = data.subKategori || '';
      fromPrediksi.value = true;
      await nextTick();
      handleAnalisis();
    }
  } catch {}
});

const kategoris = ['Makanan', 'Minuman', 'Pakaian & Fashion', 'Aksesoris & Souvenir'];

const subKategoriMap: Record<string, string[]> = {
  'Makanan'             : ['Camilan & Snack', 'Kue & Roti', 'Lauk & Bahan Makanan', 'Buah & Bahan Mentah Segar', 'Oleh-oleh Umum'],
  'Minuman'             : ['Kopi', 'Teh', 'Minuman Herbal & Seduh', 'Susu & Minuman Lainnya'],
  'Pakaian & Fashion'   : ['Atasan & Pakaian Kasual', 'Pakaian Tradisional & Etnik', 'Pakaian Anak'],
  'Aksesoris & Souvenir': ['Aksesoris & Souvenir'],
};

const subKategoris = computed(() => subKategoriMap[form.value.kategori] ?? []);

watch(() => form.value.kategori, () => { form.value.subKategori = ''; });

const scoreBannerClass = computed(() => {
  const s = result.value?.score ?? 0;
  if (s >= 75) return 'bg-gradient-to-br from-emerald-500 to-green-600';
  if (s >= 55) return 'bg-gradient-to-br from-amber-500 to-orange-500';
  return 'bg-gradient-to-br from-red-500 to-rose-600';
});

const scoreIcon = computed(() => {
  const s = result.value?.score ?? 0;
  if (s >= 75) return 'i-heroicons-rocket-launch';
  if (s >= 55) return 'i-heroicons-light-bulb';
  return 'i-heroicons-exclamation-triangle';
});

const statusBadgeClass = (status: string) => {
  if (status === 'ok') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  if (status === 'warning') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
};

const statusLabel = (status: string) => {
  if (status === 'ok') return 'Baik';
  if (status === 'warning') return 'Perhatian';
  return 'Risiko';
};

const formatNumber = (num: number) => num?.toLocaleString('id-ID') ?? '0';

const handleAnalisis = async () => {
  if (!form.value.namaProduk || !form.value.kategori || !form.value.hargaProduk) {
    toast.add({ title: 'Form Tidak Lengkap', description: 'Isi nama produk, kategori, dan harga terlebih dahulu', color: 'warning', icon: 'i-heroicons-exclamation-triangle' });
    return;
  }
  loading.value = true;
  result.value = null;
  const t = toast.add({ title: 'Menganalisis bisnis Anda...', description: 'Sedang menyiapkan rekomendasi strategis', icon: 'i-heroicons-light-bulb', color: 'neutral' });
  try {
    result.value = await $fetch('/api/recommendations/analyze', { method: 'POST', body: form.value });
    toast.remove(t.id);
    toast.add({ title: 'Analisis Selesai!', description: 'Rekomendasi strategis telah ditampilkan', color: 'success', icon: 'i-heroicons-check-circle' });
  } catch (err: any) {
    toast.remove(t.id);
    toast.add({ title: 'Analisis Gagal', description: err?.data?.message || err.message, color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    loading.value = false;
  }
};

const downloadPDF = () => {
  window.print();
};

const resetForm = () => {
  result.value = null;
  fromPrediksi.value = false;
  form.value = { namaProduk: '', kategori: '', subKategori: '', hargaProduk: 0, targetRating: 4.5 };
};
</script>

<style>
@media print {
  /* Sembunyikan sidebar form, navbar, tombol aksi */
  header, nav, aside, footer,
  .lg\:col-span-2,
  .print\:hidden {
    display: none !important;
  }
  /* Hasil analisis full-width */
  .lg\:col-span-3 {
    grid-column: 1 / -1 !important;
    max-width: 100% !important;
  }
  /* Sembunyikan tombol Actions */
  .grid.grid-cols-2.gap-3:last-of-type {
    display: none !important;
  }
  * { box-shadow: none !important; }
  body, .bg-white { background: white !important; color: black !important; }
  .rounded-2xl { break-inside: avoid; page-break-inside: avoid; }
  @page { margin: 1.5cm; size: A4; }
}
</style>

