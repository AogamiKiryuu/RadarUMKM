<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
    <!-- Mobile Overlay -->
    <Transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
        railMode ? 'w-[68px]' : 'w-60',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Brand -->
      <div
        :class="[
          'flex items-center border-b border-gray-100 dark:border-gray-800 shrink-0 overflow-hidden transition-all duration-300',
          railMode ? 'px-[14px] py-5 justify-center' : 'gap-3 px-5 py-5',
        ]"
      >
        <div class="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 shrink-0">
          <UIcon name="i-heroicons-chart-bar-square" class="w-5 h-5 text-white" />
        </div>
        <Transition name="label">
          <div v-if="!railMode" class="min-w-0 overflow-hidden">
            <p class="font-bold text-sm text-gray-900 dark:text-white leading-tight whitespace-nowrap">RadarUMKM<span class="text-emerald-600">Bogor</span></p>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 truncate">Prediksi Tren Pasar</p>
          </div>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <Transition name="label">
          <p v-if="!railMode" class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-3">Menu</p>
        </Transition>

        <UTooltip v-for="item in navItems" :key="item.to" :text="item.label" :disabled="!railMode" placement="right">
          <NuxtLink
            :to="item.to"
            :class="[
              'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 group w-full',
              railMode ? 'px-[10px] py-2.5 justify-center' : 'px-3 py-2.5',
              isActive(item.to)
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
            ]"
            @click="sidebarOpen = false"
          >
            <UIcon
              :name="item.icon"
              :class="[
                'shrink-0 transition-colors',
                railMode ? 'w-5 h-5' : 'w-4 h-4',
                isActive(item.to) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300',
              ]"
            />
            <Transition name="label">
              <span v-if="!railMode" class="flex-1 whitespace-nowrap">{{ item.label }}</span>
            </Transition>
            <Transition name="label">
              <span v-if="!railMode && isActive(item.to)" class="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </Transition>
          </NuxtLink>
        </UTooltip>
      </nav>

      <!-- Bottom Actions -->
      <div class="px-2 py-3 border-t border-gray-100 dark:border-gray-800 space-y-0.5 shrink-0">
        <!-- Logout -->
        <UTooltip text="Keluar" :disabled="!railMode" placement="right">
          <button
            :class="[
              'w-full flex items-center gap-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-150',
              railMode ? 'px-[10px] py-2.5 justify-center' : 'px-3 py-2.5',
            ]"
            @click="handleLogout"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" :class="railMode ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'" />
            <Transition name="label">
              <span v-if="!railMode" class="whitespace-nowrap">Keluar</span>
            </Transition>
          </button>
        </UTooltip>

        <!-- Rail Toggle (desktop only) -->
        <UTooltip :text="railMode ? 'Perluas sidebar' : 'Ciutkan sidebar'" placement="right">
          <button
            :class="[
              'hidden lg:flex w-full items-center gap-3 rounded-xl text-sm font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-150',
              railMode ? 'px-[10px] py-2.5 justify-center' : 'px-3 py-2.5',
            ]"
            @click="toggleRail"
          >
            <UIcon :name="railMode ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'" :class="railMode ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'" />
            <Transition name="label">
              <span v-if="!railMode" class="whitespace-nowrap">Ciutkan</span>
            </Transition>
          </button>
        </UTooltip>
      </div>
    </aside>

    <!-- Main Area -->
    <div :class="['flex-1 flex flex-col min-w-0 transition-all duration-300', railMode ? 'lg:ml-[68px]' : 'lg:ml-60']">
      <!-- Top Bar -->
      <header class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14 flex items-center px-4 sm:px-6 gap-4">
        <!-- Mobile hamburger -->
        <button class="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="sidebarOpen = true">
          <UIcon name="i-heroicons-bars-3" class="w-5 h-5" />
        </button>

        <!-- Page title from slot -->
        <div class="flex-1 min-w-0">
          <slot name="topbar" />
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-2 shrink-0">
          <slot name="topbar-actions" />
          <UButton :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" variant="ghost" color="primary" size="sm" class="hidden sm:flex" @click="toggleColorMode" />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();
const toast = useToast();
const sidebarOpen = ref(false);
const railMode = ref(false);
const isDark = computed(() => colorMode.value === 'dark');

onMounted(() => {
  const saved = localStorage.getItem('sidebar-rail');
  if (saved !== null) railMode.value = saved === 'true';
});

const toggleRail = () => {
  railMode.value = !railMode.value;
  localStorage.setItem('sidebar-rail', String(railMode.value));
  if (railMode.value) sidebarOpen.value = false;
};

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'i-heroicons-home' },
  { to: '/prediksi', label: 'Prediksi Tren', icon: 'i-heroicons-arrow-trending-up' },
  { to: '/rekomendasi', label: 'Rekomendasi', icon: 'i-heroicons-light-bulb' },
];

const isActive = (path: string) => route.path === path;

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

const handleLogout = async () => {
  const t = toast.add({ title: 'Keluar...', description: 'Sedang mengakhiri sesi Anda', icon: 'i-heroicons-arrow-right-on-rectangle', color: 'neutral' });
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    toast.remove(t.id);
    toast.add({ title: 'Berhasil Keluar', description: 'Sampai jumpa kembali! 👋', color: 'success', icon: 'i-heroicons-check-circle' });
  } catch {
    toast.remove(t.id);
    toast.add({ title: 'Gagal Keluar', description: 'Terjadi kesalahan, coba lagi', color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    router.push('/');
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Label fade + slide when toggling rail mode */
.label-enter-active {
  transition:
    opacity 0.2s ease 0.1s,
    max-width 0.3s ease;
  overflow: hidden;
}
.label-leave-active {
  transition:
    opacity 0.1s ease,
    max-width 0.25s ease;
  overflow: hidden;
}
.label-enter-from,
.label-leave-to {
  opacity: 0;
  max-width: 0;
}
.label-enter-to,
.label-leave-from {
  opacity: 1;
  max-width: 200px;
}
</style>
