<template>
  <NuxtLayout name="default">
    <template #topbar>
      <div>
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Prediksi Tren</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Hitung potensi daya tarik produk Anda</p>
      </div>
    </template>

    <div class="p-5 sm:p-7">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Prediksi Tren Pasar</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Masukkan data produk untuk menghitung potensi daya tariknya menggunakan model Machine Learning.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Form Input -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <!-- Card Header -->
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div class="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <UIcon name="i-heroicons-pencil-square" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Data Produk</h3>
            </div>

            <form @submit.prevent="handlePrediksi" class="p-5 space-y-4">
              <UFormField label="Nama Produk">
                <UInput v-model="form.namaProduk" placeholder="contoh: Lapis Talas Bogor" icon="i-heroicons-tag" class="w-full" />
              </UFormField>
              <UFormField label="Kategori">
                <USelect v-model="form.kategori" :items="kategoris" placeholder="Pilih kategori..." class="w-full" @change="form.subKategori = ''" />
              </UFormField>
              <UFormField label="Sub Kategori">
                <USelect
                  v-model="form.subKategori"
                  :items="subKategoris"
                  :disabled="!form.kategori"
                  placeholder="Pilih sub kategori..."
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Harga Produk (Rp)">
                <UInput v-model.number="form.hargaProduk" type="number" placeholder="50000" icon="i-heroicons-banknotes" class="w-full" />
              </UFormField>

              <UButton type="submit" block :loading="loading" color="primary" size="lg" class="!mt-5 font-semibold">
                <template #leading><UIcon name="i-heroicons-bolt" /></template>
                Prediksi Sekarang
              </UButton>
            </form>
          </div>

          <!-- History -->
          <div v-if="historyItems.length > 0" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5 text-gray-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Riwayat Terakhir</h3>
              </div>
              <UButton @click="clearHistory" variant="ghost" color="neutral" size="xs" icon="i-heroicons-trash">Hapus</UButton>
            </div>
            <div class="divide-y divide-gray-50 dark:divide-gray-800">
              <button
                v-for="(item, i) in historyItems"
                :key="i"
                @click="loadFromHistory(item)"
                class="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
              >
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ item.namaProduk }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ item.kategori }} · Rp {{ formatNumber(item.hargaProduk) }}</p>
                </div>
                <div class="text-right shrink-0 ml-3">
                  <span :class="item.predictionScore >= 70 ? 'text-emerald-600' : item.predictionScore >= 40 ? 'text-amber-500' : 'text-red-500'" class="text-sm font-bold">{{ item.predictionScore?.toFixed(0) }}</span>
                  <p class="text-[10px] text-gray-400">{{ new Date(item.savedAt).toLocaleDateString('id-ID') }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Results Panel -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Empty State -->
          <div
            v-if="!result && !loading && !prediksiError"
            class="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-24 text-center"
          >
            <div class="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-7 h-7 text-gray-300 dark:text-gray-600" />
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-semibold text-sm">Belum ada hasil prediksi</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Isi form di samping dan tekan "Prediksi Sekarang"</p>
          </div>

          <!-- Error State -->
          <div
            v-if="prediksiError && !loading"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-800 overflow-hidden"
          >
            <div class="px-5 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-center gap-2">
              <div class="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 text-red-500" />
              </div>
              <h3 class="text-sm font-semibold text-red-700 dark:text-red-400">Prediksi Gagal</h3>
            </div>
            <div class="p-5">
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ prediksiError }}</p>
              <UButton
                @click="prediksiError = null"
                variant="soft"
                color="error"
                size="sm"
                icon="i-heroicons-arrow-path"
                class="mt-4"
              >Coba Lagi</UButton>
            </div>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="loading" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse space-y-4">
            <div class="h-36 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
          </div>

          <template v-if="result && !loading">
            <!-- Score Banner -->
            <div
              class="rounded-2xl p-6 text-white overflow-hidden relative"
              :class="{
                'bg-gradient-to-br from-emerald-500 to-teal-600': result.predictionScore >= 70,
                'bg-gradient-to-br from-amber-500 to-orange-500': result.predictionScore >= 40 && result.predictionScore < 70,
                'bg-gradient-to-br from-red-500 to-rose-600': result.predictionScore < 40,
              }"
            >
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
              <div class="absolute -right-4 bottom-4 w-20 h-20 bg-white/5 rounded-full" />
              <div class="relative z-10">
                <p class="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Peluang Produk Laku</p>
                <div class="flex items-end gap-3 mb-3">
                  <span class="text-6xl font-extrabold leading-none tracking-tight">{{ result.predictionScore.toFixed(1) }}</span>
                  <span class="text-2xl font-medium mb-1 text-white/80">%</span>
                </div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="font-semibold text-sm">{{ getKesimpulanLabel(result.kesimpulan) }}</span>
                </div>
                <!-- Progress bar -->
                <div class="bg-white/20 rounded-full h-2">
                  <div class="h-2 rounded-full bg-white transition-all duration-700" :style="`width: ${result.predictionScore}%`" />
                </div>
              </div>
            </div>

            <!-- Analysis -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <UIcon name="i-heroicons-light-bulb" class="w-3.5 h-3.5 text-yellow-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Analisis Model</h3>
              </div>
              <div class="p-5">
                <ul class="space-y-2">
                  <li
                    v-for="(poin, i) in (Array.isArray(result.alasan) ? result.alasan : [result.alasan])"
                    :key="i"
                    class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    <span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                    <span>{{ poin }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Competitors -->
            <div v-if="result.similarProducts && result.similarProducts.length > 0" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <UIcon name="i-heroicons-eye" class="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Produk Kompetitor Serupa</h3>
                </div>
                <span class="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full"> {{ result.similarProducts.length }} produk </span>
              </div>
              <div class="p-3 space-y-2">
                <div
                  v-for="(product, idx) in result.similarProducts.slice(0, 5)"
                  :key="idx"
                  class="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div class="flex-1 min-w-0">
                    <a
                      v-if="product.url_produk && product.url_produk !== 'nan'"
                      :href="product.url_produk"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline line-clamp-2"
                      >{{ product.nama_produk }}</a
                    >
                    <p v-else class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{{ product.nama_produk }}</p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      <span class="text-xs text-gray-400">{{ product.nama_toko }}</span>
                      <span v-if="product.kemiripan_persen" class="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                        {{ product.kemiripan_persen }}% mirip
                      </span>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-sm font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(product.harga_produk) }}</p>
                    <p class="text-xs text-amber-500">⭐ {{ product.rating }}</p>
                    <p class="text-xs text-gray-400">{{ formatNumber(product.jumlah_terjual) }} terjual</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-3">
              <UButton @click="saveHistory" color="primary" icon="i-heroicons-bookmark" class="font-semibold">Simpan History</UButton>
              <UButton @click="goToRekomendasi" variant="soft" color="primary" icon="i-heroicons-light-bulb" class="font-semibold">Lihat Rekomendasi</UButton>
            </div>
          </template>

        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const form = ref({ namaProduk: '', kategori: '', subKategori: '', hargaProduk: 0 });
const result = ref<any>(null);
const prediksiError = ref<string | null>(null);

const kategoris = ['Makanan', 'Minuman', 'Pakaian & Fashion', 'Aksesoris & Souvenir'];

const subKategoriMap: Record<string, string[]> = {
  'Makanan': ['Camilan & Snack', 'Kue & Roti', 'Lauk & Bahan Makanan', 'Buah & Bahan Mentah Segar'],
  'Minuman': ['Kopi', 'Teh', 'Minuman Herbal & Seduh'],
  'Pakaian & Fashion': ['Atasan & Pakaian Kasual', 'Pakaian Tradisional & Etnik', 'Pakaian Anak'],
  'Aksesoris & Souvenir': ['Aksesoris & Souvenir'],
};

const subKategoris = computed(() => subKategoriMap[form.value.kategori] ?? []);

watch(() => form.value.kategori, () => { form.value.subKategori = ''; });

const formatNumber = (num: number) => num?.toLocaleString('id-ID') ?? '0';

const getKesimpulanLabel = (kesimpulan: string) => {
  if (!kesimpulan) return '';
  if (kesimpulan.includes('SANGAT')) return '🌟 Sangat Menarik';
  if (kesimpulan.includes('CUKUP')) return '✅ Cukup Menarik';
  return '⚠️ Kurang Menarik';
};

const handlePrediksi = async () => {
  loading.value = true;
  result.value = null;
  prediksiError.value = null;
  const t = toast.add({ title: 'Menganalisis pasar...', description: 'AI sedang memproses data produk Anda, harap tunggu', icon: 'i-heroicons-cpu-chip', color: 'neutral' });
  try {
    result.value = await $fetch('/api/predict', { method: 'POST', body: form.value });
    toast.remove(t.id);
    toast.add({ title: '✅ Prediksi Berhasil!', description: 'Hasil analisis pasar telah ditampilkan di bawah', color: 'success', icon: 'i-heroicons-chart-bar' });
  } catch (err: any) {
    toast.remove(t.id);
    prediksiError.value = err?.data?.message || err.message || 'Terjadi kesalahan tidak diketahui.';
  } finally {
    loading.value = false;
  }
};

const HISTORY_KEY = 'prediksiHistory';
const historyItems = ref<any[]>([]);

const loadHistory = () => {
  try { historyItems.value = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { historyItems.value = []; }
};

const saveHistory = () => {
  if (!result.value) return;
  const item = { ...form.value, predictionScore: result.value.predictionScore, kesimpulan: result.value.kesimpulan, savedAt: new Date().toISOString() };
  const updated = [item, ...historyItems.value.filter((h) => h.namaProduk !== item.namaProduk || h.hargaProduk !== item.hargaProduk)].slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  historyItems.value = updated;
  toast.add({ title: 'Tersimpan!', description: 'Riwayat lokal diperbarui (maks 5)', color: 'success', icon: 'i-heroicons-bookmark' });
};

const loadFromHistory = async (item: any) => {
  form.value = { namaProduk: item.namaProduk, kategori: item.kategori, subKategori: '', hargaProduk: item.hargaProduk };
  await nextTick(); // tunggu watch kategori selesai clear subKategori
  form.value.subKategori = item.subKategori || '';
  result.value = null;
  prediksiError.value = null;
  await nextTick();
  handlePrediksi();
};

const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  historyItems.value = [];
};

const goToRekomendasi = () => {
  sessionStorage.setItem('rekomendasiFromPrediksi', JSON.stringify(form.value));
  router.push('/rekomendasi');
};

onMounted(loadHistory);
</script>
