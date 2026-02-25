<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Analisis Rekomendasi Bisnis</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Dapatkan insight mendalam untuk strategi bisnis Anda
          </p>
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

            <form @submit.prevent="handleAnalisis" class="space-y-4">
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

              <UButton type="submit" block :loading="loading" size="lg" color="green">
                Analisis Sekarang
              </UButton>
            </form>
          </UCard>
        </div>

        <!-- Results -->
        <div class="lg:col-span-2">
          <UCard v-if="!result">
            <div class="text-center py-20">
              <UIcon name="i-heroicons-light-bulb" class="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <p class="text-gray-600 dark:text-gray-400">
                Isi form di samping untuk mendapatkan rekomendasi bisnis
              </p>
            </div>
          </UCard>

          <div v-else class="space-y-6">
            <!-- Market Comparison -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Perbandingan dengan Pasar</h3>
              </template>
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Harga Anda</p>
                  <p class="text-2xl font-bold">Rp {{ formatNumber(form.hargaProduk) }}</p>
                </div>
                <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Rata-rata Pasar</p>
                  <p class="text-2xl font-bold">Rp {{ formatNumber(result.avgHargaKompetitor || 0) }}</p>
                </div>
                <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Rating Target</p>
                  <p class="text-2xl font-bold">⭐ {{ form.targetRating }}</p>
                </div>
                <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Rata-rata Rating Pasar</p>
                  <p class="text-2xl font-bold">⭐ {{ result.avgRatingKompetitor?.toFixed(1) || 0 }}</p>
                </div>
              </div>
            </UCard>

            <!-- Recommendations -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Rekomendasi Strategis</h3>
              </template>
              <div class="prose dark:prose-invert max-w-none">
                <div v-html="formatRecommendations(result.recommendations)"></div>
              </div>
            </UCard>

            <!-- Competitor Analysis -->
            <UCard v-if="result.similarProducts && result.similarProducts.length > 0">
              <template #header>
                <h3 class="text-lg font-semibold">Analisis Kompetitor</h3>
              </template>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Produk</th>
                      <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Toko</th>
                      <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Harga</th>
                      <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                      <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Terjual</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(product, idx) in result.similarProducts.slice(0, 10)" :key="idx">
                      <td class="px-4 py-3">{{ product.nama_produk }}</td>
                      <td class="px-4 py-3">{{ product.nama_toko }}</td>
                      <td class="px-4 py-3">Rp {{ formatNumber(product.harga_produk) }}</td>
                      <td class="px-4 py-3">⭐ {{ product.rating }}</td>
                      <td class="px-4 py-3">{{ product.jumlah_terjual }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </UCard>

            <!-- Actions -->
            <div class="flex gap-4">
              <UButton @click="saveRecommendation" color="green" block>
                Simpan Rekomendasi
              </UButton>
              <UButton @click="downloadPDF" variant="soft" block>
                <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
                Download PDF
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const form = ref({
  namaProduk: '',
  kategori: '',
  subKategori: '',
  hargaProduk: 0,
  targetRating: 4.5
})

const kategoris = [
  'Makanan & Minuman',
  'Kerajinan',
  'Fashion',
  'Lainnya'
]

const result = ref<any>(null)

const formatNumber = (num: number) => {
  return num.toLocaleString('id-ID')
}

const formatRecommendations = (text: string) => {
  // Format text dengan line breaks dan bold untuk headers
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(\d+\.)/gm, '<br><strong>$1</strong>')
}

const handleAnalisis = async () => {
  loading.value = true
  try {
    const { data, error } = await useFetch('/api/recommendations/analyze', {
      method: 'POST',
      body: form.value
    })

    if (error.value) throw new Error('Gagal melakukan analisis')
    
    result.value = data.value

    toast.add({
      title: 'Analisis Berhasil',
      description: 'Rekomendasi telah ditampilkan',
      color: 'green'
    })
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message,
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const saveRecommendation = async () => {
  try {
    await $fetch('/api/recommendations/save', {
      method: 'POST',
      body: {
        ...form.value,
        ...result.value
      }
    })

    toast.add({
      title: 'Tersimpan',
      description: 'Rekomendasi berhasil disimpan',
      color: 'green'
    })
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan rekomendasi',
      color: 'red'
    })
  }
}

const downloadPDF = () => {
  toast.add({
    title: 'Coming Soon',
    description: 'Fitur download PDF sedang dalam development',
    color: 'blue'
  })
}
</script>
