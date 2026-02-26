<template>
  <NuxtLayout name="default">
    <template #topbar>
      <div>
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Ringkasan data pasar UMKM Bogor</p>
      </div>
    </template>

    <div class="p-5 sm:p-7 space-y-7">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Selamat datang 👋</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Berikut ringkasan data produk UMKM Bogor dari dataset pasar.</p>
        </div>
        <UButton icon="i-heroicons-arrow-path" variant="ghost" color="gray" size="sm" :loading="loadingData" @click="fetchDashboardData">
          <span class="hidden sm:inline">Refresh</span>
        </UButton>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <template v-if="loadingData">
          <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
            <div class="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded mb-3" />
            <div class="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </template>
        <template v-else>
          <div
            v-for="stat in statCards"
            :key="stat.label"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:shadow-gray-100 dark:hover:shadow-gray-900/50 transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ stat.label }}</p>
              <div :class="`p-2 ${stat.bg} rounded-xl`">
                <UIcon :name="stat.icon" :class="`w-4 h-4 ${stat.iconColor}`" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p v-if="stat.sub" class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ stat.sub }}</p>
          </div>
        </template>
      </div>

      <!-- CTA Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          class="group relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/40 transition-all duration-200"
          @click="router.push('/prediksi')"
        >
          <div class="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
          <div class="absolute -right-2 bottom-4 w-16 h-16 bg-white/5 rounded-full" />
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="p-2.5 bg-white/20 rounded-xl">
                <UIcon name="i-heroicons-arrow-trending-up" class="w-5 h-5 text-white" />
              </div>
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <h3 class="text-white font-bold text-base mb-1">Prediksi Tren</h3>
            <p class="text-emerald-100/80 text-sm mb-4">Analisis daya tarik produk dengan model Machine Learning</p>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
              Mulai Prediksi <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
            </span>
          </div>
        </div>

        <div
          class="group relative bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-purple-200/50 dark:hover:shadow-purple-900/40 transition-all duration-200"
          @click="router.push('/rekomendasi')"
        >
          <div class="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
          <div class="absolute -right-2 bottom-4 w-16 h-16 bg-white/5 rounded-full" />
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="p-2.5 bg-white/20 rounded-xl">
                <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-white" />
              </div>
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <h3 class="text-white font-bold text-base mb-1">Analisis Rekomendasi</h3>
            <p class="text-violet-100/80 text-sm mb-4">Dapatkan strategi bisnis berbasis data pasar nyata</p>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
              Analisis Sekarang <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div v-for="chart in chartCards" :key="chart.title" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div :class="`p-1.5 ${chart.iconBg} rounded-lg`">
              <UIcon :name="chart.icon" :class="`w-3.5 h-3.5 ${chart.iconColor}`" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ chart.title }}</h3>
          </div>
          <div class="h-64">
            <component :is="chart.component" v-if="chartData[chart.key]" :data="chartData[chart.key]" :options="chart.options" />
            <div v-else class="h-full flex items-center justify-center">
              <div class="text-center">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse" />
                <p class="text-xs text-gray-400">Memuat data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marketplace & Top Keywords Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Marketplace Distribution -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <UIcon name="i-heroicons-shopping-cart" class="w-3.5 h-3.5 text-green-500" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Distribusi Marketplace</h3>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="w-48 h-48 shrink-0">
              <Doughnut v-if="chartData.marketplace" :data="chartData.marketplace" :options="doughnutOptions" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
              </div>
            </div>
            <div class="flex-1 space-y-3">
              <div
                v-for="(mp, i) in marketplaceStats"
                :key="mp.name"
                class="flex items-center gap-3"
              >
                <div class="w-3 h-3 rounded-full shrink-0" :style="{ background: mpColors[i] }" />
                <div class="flex-1">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ mp.name }}</span>
                    <span class="text-gray-500 dark:text-gray-400">{{ mp.count.toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      :style="{ width: `${(mp.count / totalProducts) * 100}%`, background: mpColors[i] }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Keywords Chart -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="p-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <UIcon name="i-heroicons-magnifying-glass" class="w-3.5 h-3.5 text-violet-500" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Top 15 Keyword Produk</h3>
          </div>
          <div class="h-64">
            <Bar v-if="chartData.topKeywords" :data="chartData.topKeywords" :options="keywordBarOptions" />
            <div v-else class="h-full flex items-center justify-center">
              <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products per Marketplace -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <UIcon name="i-heroicons-fire" class="w-3.5 h-3.5 text-orange-500" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Produk Terlaris per Platform</h3>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              v-for="mp in marketplaceFilters"
              :key="mp.key"
              @click="selectedMarketplace = mp.key"
              :class="['px-3 py-1.5 text-xs font-semibold rounded-lg transition-all', selectedMarketplace === mp.key ? mp.activeClass : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']"
            >
              {{ mp.label }}
            </button>
          </div>
        </div>
        <div class="divide-y divide-gray-50 dark:divide-gray-800">
          <div v-if="loadingData" class="p-6 space-y-3">
            <div v-for="i in 5" :key="i" class="flex items-center gap-4 animate-pulse">
              <div class="w-6 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <div class="flex-1 space-y-1.5">
                <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div class="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
              </div>
              <div class="w-20 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
          <template v-else>
            <div v-if="!filteredTopProducts.length" class="p-10 text-center text-sm text-gray-400">Tidak ada data untuk platform ini</div>
            <a
              v-for="(product, idx) in filteredTopProducts"
              :key="idx"
              :href="product.url && product.url !== 'nan' ? product.url : undefined"
              :target="product.url && product.url !== 'nan' ? '_blank' : undefined"
              rel="noopener noreferrer"
              :class="['flex items-center gap-4 px-5 py-3.5 transition-colors group', product.url && product.url !== 'nan' ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer' : 'cursor-default']"
            >
              <span class="text-base font-bold text-gray-200 dark:text-gray-700 w-6 text-center shrink-0 group-hover:text-gray-300 dark:group-hover:text-gray-600 transition-colors">#{{ idx + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ product.namaProduk }}</p>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span class="text-xs text-gray-400">{{ product.namaToko ?? 'Toko tidak diketahui' }}</span>
                  <span class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{{ product.kategori }}</span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-bold text-gray-900 dark:text-white">Rp {{ product.hargaProduk.toLocaleString('id-ID') }}</p>
                <p class="text-xs text-gray-400 mt-0.5">⭐ {{ product.rating }} &bull; {{ product.jumlahTerjual.toLocaleString('id-ID') }} terjual</p>
              </div>
              <UIcon
                v-if="product.url && product.url !== 'nan'"
                name="i-heroicons-arrow-top-right-on-square"
                class="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 shrink-0 transition-colors"
              />
            </a>
          </template>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Bar, Pie, Line, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, DoughnutController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, DoughnutController);

definePageMeta({ middleware: 'auth' });

const router = useRouter();
const toast = useToast();
const loadingData = ref(true);

const stats = ref({ totalProducts: 0, avgPrice: 0, avgRating: 0, totalSold: 0 });
const chartData = ref<any>({});
const marketplaceStats = ref<{ name: string; count: number }[]>([]);
const totalProducts = computed(() => stats.value.totalProducts || 1);
const topProductsByMarketplace = ref<Record<string, any[]>>({});
const selectedMarketplace = ref('tokopedia');

const marketplaceFilters = [
  { key: 'tokopedia', label: 'Tokopedia', activeClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  { key: 'shopee', label: 'Shopee', activeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { key: 'lazada', label: 'Lazada', activeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
];

const filteredTopProducts = computed(() => topProductsByMarketplace.value[selectedMarketplace.value] ?? []);

const mpColors = [
  'rgba(0, 177, 79, 0.85)',
  'rgba(238, 77, 45, 0.85)',
  'rgba(0, 100, 220, 0.85)',
  'rgba(107, 114, 128, 0.85)',
];

const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
const pieOptions = { responsive: true, maintainAspectRatio: false };
const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '65%' };
const keywordBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { ticks: { font: { size: 10 } } } },
};

const formatNumber = (num: number) => num?.toLocaleString('id-ID') ?? '0';

const statCards = computed(() => [
  {
    label: 'Total Produk',
    value: formatNumber(stats.value.totalProducts),
    icon: 'i-heroicons-cube',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    sub: 'dalam dataset',
  },
  {
    label: 'Rata-rata Harga',
    value: `Rp ${formatNumber(stats.value.avgPrice)}`,
    icon: 'i-heroicons-banknotes',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    sub: 'per produk',
  },
  { label: 'Rata-rata Rating', value: `${stats.value.avgRating?.toFixed(1)} ★`, icon: 'i-heroicons-star', bg: 'bg-yellow-50 dark:bg-yellow-900/20', iconColor: 'text-yellow-500', sub: 'dari 5.0' },
  {
    label: 'Total Terjual',
    value: formatNumber(stats.value.totalSold),
    icon: 'i-heroicons-shopping-bag',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    sub: 'unit terjual',
  },
]);

const chartCards = computed(() => [
  { title: 'Top 10 Produk Terlaris', key: 'topProducts', component: Bar, options: barOptions, icon: 'i-heroicons-fire', iconBg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-500' },
  { title: 'Distribusi Kategori', key: 'categories', component: Pie, options: pieOptions, icon: 'i-heroicons-tag', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-500' },
  { title: 'Produk Rating Tertinggi', key: 'topRated', component: Bar, options: barOptions, icon: 'i-heroicons-star', iconBg: 'bg-yellow-50 dark:bg-yellow-900/20', iconColor: 'text-yellow-500' },
  { title: 'Distribusi Harga', key: 'priceDistribution', component: Line, options: barOptions, icon: 'i-heroicons-chart-bar', iconBg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500' },
]);

const fetchDashboardData = async () => {
  loadingData.value = true;
  const t = toast.add({ title: 'Memuat data dashboard...', description: 'Mengambil statistik dari server', icon: 'i-heroicons-arrow-path', color: 'neutral' });
  try {
    const data = await $fetch<any>('/api/dashboard/stats');
    if (data) {
      stats.value = data.stats;
      chartData.value = data.charts;
      marketplaceStats.value = data.marketplaceDistribution ?? [];
      topProductsByMarketplace.value = data.topProductsByMarketplace ?? {};
    }
    toast.remove(t.id);
    toast.add({ title: 'Data Berhasil Dimuat', description: 'Dashboard siap digunakan', color: 'success', icon: 'i-heroicons-check-circle' });
  } catch (err: any) {
    toast.remove(t.id);
    toast.add({ title: 'Gagal Memuat Data', description: err?.data?.message || err.message, color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    loadingData.value = false;
  }
};

onMounted(fetchDashboardData);
</script>
