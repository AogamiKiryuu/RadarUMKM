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
      <div class="mb-7">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Prediksi Tren Pasar</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Analisis berbasis Machine Learning v3</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- ── Form Panel ── -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 flex items-center gap-2">
              <div class="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <UIcon name="i-heroicons-pencil-square" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Data Produk Anda</h3>
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
          <div v-if="historyItems.length > 0" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
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
          <!-- Produk Terpopuler (pindah ke kiri) -->
          <div v-if="result && !loading && result.produkTerpopuler && result.produkTerpopuler.produk?.length > 0" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div class="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <UIcon name="i-heroicons-fire" class="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Produk Paling Digemari</h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ result.produkTerpopuler.label }}</p>
              </div>
            </div>
            <div class="p-3 space-y-2">
              <div
                v-for="(produk, idx) in result.produkTerpopuler.produk"
                :key="idx"
                class="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div class="flex items-start gap-2.5 flex-1 min-w-0">
                  <span class="text-xs font-bold text-gray-300 dark:text-gray-600 mt-0.5 w-5 shrink-0">#{{ idx + 1 }}</span>
                  <div class="min-w-0">
                    <a
                      v-if="produk.urlProduk && produk.urlProduk !== 'nan'"
                      :href="produk.urlProduk"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline line-clamp-2"
                    >{{ produk.nama }}</a>
                    <p v-else class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{{ produk.nama }}</p>
                    <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span class="text-xs text-gray-400">{{ produk.namaToko }}</span>
                      <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded">{{ produk.marketplace }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(produk.harga) }}</p>
                  <p class="text-xs text-amber-500">⭐ {{ produk.rating }}</p>
                  <p class="text-xs text-gray-400">{{ formatNumber(produk.jumlahTerjual) }} terjual</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ── Results Panel ── -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Empty State -->
          <div
            v-if="!result && !loading && !prediksiError"
            class="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-24 text-center"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-8 h-8 text-emerald-300 dark:text-emerald-700" />
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-semibold text-sm">Belum ada hasil prediksi</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Isi form di samping dan tekan "Prediksi Sekarang"</p>
          </div>

          <!-- Error State -->
          <div v-if="prediksiError && !loading" class="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-800 overflow-hidden">
            <div class="px-5 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-center gap-2">
              <div class="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 text-red-500" />
              </div>
              <h3 class="text-sm font-semibold text-red-700 dark:text-red-400">Prediksi Gagal</h3>
            </div>
            <div class="p-5">
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ prediksiError }}</p>
              <UButton @click="prediksiError = null" variant="soft" color="error" size="sm" icon="i-heroicons-arrow-path" class="mt-4">Coba Lagi</UButton>
            </div>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="loading" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse space-y-4">
            <div class="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
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
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
              <div class="absolute -left-4 bottom-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
              <div class="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <p class="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Peluang Produk Laku</p>
                  <div class="flex items-end gap-2 mb-2">
                    <span class="text-6xl font-extrabold leading-none tracking-tight">{{ result.predictionScore.toFixed(1) }}</span>
                    <span class="text-2xl font-medium mb-1 text-white/80">%</span>
                  </div>
                  <p class="font-semibold text-sm mb-3">{{ getKesimpulanLabel(result.kesimpulan) }}</p>
                  <!-- Progress bar -->
                  <div class="bg-white/20 rounded-full h-2 w-48">
                    <div class="h-2 rounded-full bg-white transition-all duration-700" :style="`width: ${result.predictionScore}%`" />
                  </div>
                </div>
                <!-- Konteks Harga Badge -->
                <div v-if="result.konteksHarga" class="shrink-0 text-center bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
                  <p class="text-white/70 text-[10px] uppercase tracking-wider mb-1">Segmen Harga</p>
                  <p class="text-white font-bold text-lg">{{ result.konteksHarga.segmen }}</p>
                  <p class="text-white/70 text-[10px] mt-1">vs median pasar</p>
                  <p
                    class="font-bold text-sm mt-0.5"
                    :class="result.konteksHarga.selisihPersen > 0 ? 'text-red-200' : 'text-green-200'"
                  >
                    {{ result.konteksHarga.selisihPersen > 0 ? '+' : '' }}{{ result.konteksHarga.selisihPersen?.toFixed(0) }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Konteks Harga Detail -->
            <div v-if="result.konteksHarga" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <UIcon name="i-heroicons-banknotes" class="w-3.5 h-3.5 text-blue-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Posisi Harga di Pasar</h3>
              </div>
              <div class="p-5 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p class="text-xs text-gray-400 mb-1">Median Pasar</p>
                  <p class="font-bold text-gray-900 dark:text-white text-sm">Rp {{ formatNumber(result.konteksHarga.medianPasar) }}</p>
                </div>
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p class="text-xs text-gray-400 mb-1">Harga Anda</p>
                  <p class="font-bold text-gray-900 dark:text-white text-sm">Rp {{ formatNumber(form.hargaProduk) }}</p>
                </div>
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p class="text-xs text-gray-400 mb-1">Selisih</p>
                  <p
                    class="font-bold text-sm"
                    :class="result.konteksHarga.selisihPersen > 0 ? 'text-red-500' : 'text-emerald-600'"
                  >
                    {{ result.konteksHarga.selisihPersen > 0 ? '+' : '' }}{{ result.konteksHarga.selisihPersen?.toFixed(1) }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Analysis (Alasan) -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <UIcon name="i-heroicons-light-bulb" class="w-3.5 h-3.5 text-yellow-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Analisis Model</h3>
              </div>
              <div class="p-5">
                <ul class="space-y-2.5">
                  <li
                    v-for="(poin, i) in (Array.isArray(result.alasan) ? result.alasan : [result.alasan])"
                    :key="i"
                    class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    <span class="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                    <span>{{ poin }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Insight Pasar -->
            <div v-if="result.insightPasar" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <div class="p-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <UIcon name="i-heroicons-globe-alt" class="w-3.5 h-3.5 text-violet-500" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Insight Pasar</h3>
              </div>
              <div class="p-5 space-y-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{{ result.insightPasar.narasi }}"</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                    <p class="text-[10px] text-violet-500 uppercase tracking-wider mb-1">Kategori Terpopuler</p>
                    <p class="font-bold text-sm text-gray-900 dark:text-white">{{ result.insightPasar.kategoriTerpopuler }}</p>
                  </div>
                  <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                    <p class="text-[10px] text-violet-500 uppercase tracking-wider mb-1">Sub-Kategori Terpopuler</p>
                    <p class="font-bold text-sm text-gray-900 dark:text-white">{{ result.insightPasar.subKategoriTerpopuler }}</p>
                  </div>
                </div>
                <div v-if="result.insightPasar.posisiKategoriAnda" class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p class="text-sm text-emerald-700 dark:text-emerald-300">
                    Kategori <strong>{{ form.kategori }}</strong> berada di posisi
                    <strong>#{{ result.insightPasar.posisiKategoriAnda }}</strong>
                    dari {{ result.insightPasar.totalKategori }} kategori.
                  </p>
                </div>
                <!-- Sub ranking dalam kategori ini -->
                <div v-if="result.insightPasar.subKategoriDalamKategoriIni?.length > 0">
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sub-Kategori dalam {{ form.kategori }}</p>
                  <div class="space-y-1.5">
                    <div
                      v-for="(sub, idx) in result.insightPasar.subKategoriDalamKategoriIni"
                      :key="sub.sub_kategori"
                      class="flex items-center justify-between p-2.5 rounded-lg"
                      :class="idx === 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800'"
                    >
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-gray-400 w-5">#{{ idx + 1 }}</span>
                        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ sub.sub_kategori }}</span>
                      </div>
                      <div class="text-right">
                        <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ sub.total_terjual?.toLocaleString('id-ID') }} terjual</p>
                        <p class="text-[10px] text-gray-400">⭐ {{ sub.avg_rating }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </template>
        </div>
      </div>

      <!-- ── Kompetitor Serupa — Full Width ── -->
      <div
        v-if="result && !loading && result.similarProducts && result.similarProducts.length > 0"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm mt-6"
      >
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <UIcon name="i-heroicons-eye" class="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Produk Kompetitor Serupa</h3>
              <p class="text-xs text-gray-400 mt-0.5">Produk lain di pasar yang mirip dengan produk Anda</p>
            </div>
          </div>
          <span class="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full">{{ result.similarProducts.length }} produk</span>
        </div>
        <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(product, idx) in result.similarProducts"
            :key="idx"
            class="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-1">
                <span class="text-xs font-bold text-gray-300 dark:text-gray-600">#{{ idx + 1 }}</span>
              </div>
              <a
                v-if="product.url_produk && product.url_produk !== 'nan'"
                :href="product.url_produk"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline line-clamp-2 leading-snug"
              >{{ product.nama_produk }}</a>
              <p v-else class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">{{ product.nama_produk }}</p>
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span class="text-xs text-gray-400">{{ product.nama_toko }}</span>
                <span v-if="product.kemiripan_persen" class="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">{{ product.kemiripan_persen }}% mirip</span>
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
  'Makanan': ['Camilan & Snack', 'Kue & Roti', 'Lauk & Bahan Makanan', 'Makanan Tradisional'],
  'Minuman': ['Kopi', 'Minuman Tradisional', 'Teh'],
  'Pakaian & Fashion': ['Atasan & Pakaian Kasual', 'Pakaian Tradisional'],
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
    toast.add({ title: '✅ Prediksi Berhasil!', description: 'Hasil analisis pasar telah ditampilkan', color: 'success', icon: 'i-heroicons-chart-bar' });
    // Auto-save to history
    saveHistory();
  } catch (err: any) {
    toast.remove(t.id);
    prediksiError.value = err?.data?.message || err.message || 'Terjadi kesalahan tidak diketahui.';
  } finally {
    loading.value = false;
  }
};

// ── History ───────────────────────────────────────────────────────────────────
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
};

const loadFromHistory = async (item: any) => {
  form.value = { namaProduk: item.namaProduk, kategori: item.kategori, subKategori: '', hargaProduk: item.hargaProduk };
  await nextTick();
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

onMounted(loadHistory);
</script>
