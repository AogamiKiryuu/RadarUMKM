<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Prediksi Tren Pasar</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Hitung peluang sukses produk Anda</p>
        </div>
        <UButton @click="router.push('/dashboard')" variant="soft">
          <UIcon name="i-heroicons-arrow-left" class="mr-2" />
          Kembali
        </UButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form Input -->
        <div class="lg:col-span-1">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Input Data Produk</h3>
            </template>

            <form @submit.prevent="handlePrediksi" class="space-y-4">
              <UFormGroup label="Nama Produk" required>
                <UInput v-model="form.namaProduk" placeholder="Lapis Talas Bogor..." />
              </UFormGroup>

              <UFormGroup label="Kategori" required>
                <USelect v-model="form.kategori" :options="kategoris" />
              </UFormGroup>

              <UFormGroup label="Sub Kategori">
                <UInput v-model="form.subKategori" placeholder="Makanan Ringan..." />
              </UFormGroup>

              <UFormGroup label="Harga Produk (Rp)" required>
                <UInput v-model.number="form.hargaProduk" type="number" placeholder="50000" />
              </UFormGroup>

              <UFormGroup label="Target Rating (0-5)" required>
                <UInput v-model.number="form.targetRating" type="number" step="0.1" min="0" max="5" placeholder="4.5" />
              </UFormGroup>

              <UButton type="submit" block :loading="loading" size="lg"> Prediksi Sekarang </UButton>
            </form>
          </UCard>
        </div>

        <!-- Results -->
        <div class="lg:col-span-2">
          <UCard v-if="!result">
            <div class="text-center py-20">
              <UIcon name="i-heroicons-chart-bar-square" class="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <p class="text-gray-600 dark:text-gray-400">Isi form di samping untuk melihat hasil prediksi</p>
            </div>
          </UCard>

          <div v-else class="space-y-6">
            <!-- Score Card -->
            <UCard>
              <div class="text-center py-8">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Skor Prediksi</p>
                <div class="relative inline-block">
                  <div class="text-6xl font-bold" :class="getScoreColor(result.predictionScore)">{{ result.predictionScore.toFixed(1) }}%</div>
                  <UBadge :color="result.predictionLabel === 1 ? 'green' : 'red'" size="lg" class="mt-4">
                    {{ result.predictionLabel === 1 ? 'Berpotensi Menarik' : 'Kurang Menarik' }}
                  </UBadge>
                </div>
              </div>
            </UCard>

            <!-- Insight -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Insight & Analisis</h3>
              </template>
              <div class="prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-line">{{ result.insight }}</p>
              </div>
            </UCard>

            <!-- Similar Products -->
            <UCard v-if="result.similarProducts && result.similarProducts.length > 0">
              <template #header>
                <h3 class="text-lg font-semibold">Produk Kompetitor Serupa</h3>
              </template>
              <div class="space-y-3">
                <div v-for="(product, idx) in result.similarProducts.slice(0, 5)" :key="idx" class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex-1">
                    <p class="font-medium">{{ product.nama_produk }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.nama_toko }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold">Rp {{ formatNumber(product.harga_produk) }}</p>
                    <p class="text-sm text-yellow-600">⭐ {{ product.rating }}</p>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Actions -->
            <div class="flex gap-4">
              <UButton @click="saveHistory" color="green" block> Simpan ke History </UButton>
              <UButton @click="router.push('/rekomendasi')" variant="soft" block> Lanjut ke Rekomendasi </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const form = ref({
  namaProduk: '',
  kategori: '',
  subKategori: '',
  hargaProduk: 0,
  targetRating: 4.5,
});

const kategoris = ['Makanan & Minuman', 'Kerajinan', 'Fashion', 'Lainnya'];

const result = ref<any>(null);

const formatNumber = (num: number) => {
  return num.toLocaleString('id-ID');
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const handlePrediksi = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/predict', {
      method: 'POST',
      body: form.value,
    });

    if (error.value) throw new Error('Gagal melakukan prediksi');

    result.value = data.value;

    toast.add({
      title: 'Prediksi Berhasil',
      description: 'Hasil prediksi telah ditampilkan',
      color: 'green',
    });
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message,
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};

const saveHistory = async () => {
  try {
    await $fetch('/api/predictions/save', {
      method: 'POST',
      body: {
        ...form.value,
        ...result.value,
      },
    });

    toast.add({
      title: 'Tersimpan',
      description: 'Prediksi berhasil disimpan ke history',
      color: 'green',
    });
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan prediksi',
      color: 'red',
    });
  }
};
</script>
