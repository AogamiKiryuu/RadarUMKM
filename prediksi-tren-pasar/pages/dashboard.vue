<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Dashboard</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Analisis Distribusi Produk Khas Bogor
          </p>
        </div>
        <UButton @click="handleLogout" color="red" variant="soft">
          Logout
        </UButton>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Produk</p>
              <p class="text-2xl font-bold mt-1">{{ stats.totalProducts }}</p>
            </div>
            <UIcon name="i-heroicons-cube" class="w-8 h-8 text-blue-500" />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Rata-rata Harga</p>
              <p class="text-2xl font-bold mt-1">Rp {{ formatNumber(stats.avgPrice) }}</p>
            </div>
            <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 text-green-500" />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Rata-rata Rating</p>
              <p class="text-2xl font-bold mt-1">{{ stats.avgRating.toFixed(1) }}</p>
            </div>
            <UIcon name="i-heroicons-star" class="w-8 h-8 text-yellow-500" />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Terjual</p>
              <p class="text-2xl font-bold mt-1">{{ formatNumber(stats.totalSold) }}</p>
            </div>
            <UIcon name="i-heroicons-shopping-cart" class="w-8 h-8 text-purple-500" />
          </div>
        </UCard>
      </div>

      <!-- Navigation Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="router.push('/prediksi')">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <UIcon name="i-heroicons-chart-bar" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold">Prediksi Tren Pasar</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Prediksi daya tarik produk menggunakan ML
              </p>
            </div>
          </div>
        </UCard>

        <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="router.push('/rekomendasi')">
          <div class="flex items-center space-x-4">
            <div class="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <UIcon name="i-heroicons-light-bulb" class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold">Analisis Rekomendasi</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Dapatkan insight dan rekomendasi bisnis
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Top 10 Produk Terlaris</h3>
          </template>
          <div class="h-80">
            <Bar v-if="chartData.topProducts" :data="chartData.topProducts" :options="chartOptions" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Distribusi Kategori</h3>
          </template>
          <div class="h-80">
            <Pie v-if="chartData.categories" :data="chartData.categories" :options="chartOptions" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Produk Rating Tertinggi</h3>
          </template>
          <div class="h-80">
            <Bar v-if="chartData.topRated" :data="chartData.topRated" :options="chartOptions" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Distribusi Harga</h3>
          </template>
          <div class="h-80">
            <Line v-if="chartData.priceDistribution" :data="chartData.priceDistribution" :options="chartOptions" />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Pie, Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title)

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const toast = useToast()

const stats = ref({
  totalProducts: 0,
  avgPrice: 0,
  avgRating: 0,
  totalSold: 0
})

const chartData = ref<any>({})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const formatNumber = (num: number) => {
  return num.toLocaleString('id-ID')
}

const fetchDashboardData = async () => {
  try {
    const { data, error } = await useFetch('/api/dashboard/stats')
    
    if (error.value) throw new Error('Gagal memuat data dashboard')
    
    if (data.value) {
      stats.value = data.value.stats
      chartData.value = data.value.charts
    }
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message,
      color: 'red'
    })
  }
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Gagal logout',
      color: 'red'
    })
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
