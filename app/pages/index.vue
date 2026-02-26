<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 antialiased">
    <!-- ── Navbar ── -->
    <header
      class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'"
    >
      <div class="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-6">
        <!-- Brand -->
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar-square" class="w-[18px] h-[18px] text-white" />
          </div>
          <span class="font-bold text-gray-900 dark:text-white text-sm">RadarUMKM<span class="text-emerald-600">Bogor</span></span>
        </div>
        <!-- Nav Links (desktop) -->
        <nav class="hidden md:flex items-center gap-1 ml-4">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            @click.prevent="scrollTo(link.id)"
            >{{ link.label }}</a
          >
        </nav>
        <!-- Right side -->
        <div class="ml-auto flex items-center gap-2">
          <button class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" :title="isDark ? 'Mode Terang' : 'Mode Gelap'" @click="toggleDark">
            <UIcon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="w-5 h-5" />
          </button>
          <button class="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="openAuth('login')">
            Masuk
          </button>
          <button class="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all duration-150" @click="openAuth('register')">
            Daftar Gratis
          </button>
        </div>
      </div>
    </header>

    <!-- ── Hero ── -->
    <section id="hero" class="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/30" />
      <div
        class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style="background-image: linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px); background-size: 48px 48px"
      />
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-200/20 dark:bg-teal-700/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div
            class="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6"
          >
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Data dari 3 marketplace terbesar Indonesia
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-5">
            Prediksi Tren Produk<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">UMKM Bogor</span><br />
            dengan AI
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
            Analisis daya tarik produk Anda berdasarkan data nyata dari Tokopedia, Shopee, dan Lazada — bukan tebakan.
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 transition-all duration-150 hover:scale-[1.02]"
              @click="openAuth('register')"
            >
              <UIcon name="i-heroicons-rocket-launch" class="w-4 h-4" />
              Mulai Gratis
            </button>
            <button
              class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-150"
              @click="scrollTo('cara-kerja')"
            >
              Lihat Cara Kerja
              <UIcon name="i-heroicons-arrow-down" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Hero Visual / App Mockup -->
        <div class="hidden lg:block">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-gray-200/60 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div class="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div class="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div class="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span class="ml-3 text-xs text-gray-400 font-medium">Hasil Prediksi — RadarUMKMBogor</span>
            </div>
            <div class="p-5 space-y-4">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
                <p class="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">Skor Daya Tarik</p>
                <p class="text-5xl font-extrabold leading-none">83.4<span class="text-2xl font-normal opacity-70">%</span></p>
                <p class="mt-2 font-semibold text-sm">🌟 SANGAT MENARIK</p>
                <div class="mt-3 bg-white/20 rounded-full h-1.5">
                  <div class="h-1.5 rounded-full bg-white w-[83%]" />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="m in mockStats" :key="m.label" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p class="text-base font-bold text-gray-900 dark:text-white">{{ m.value }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ m.label }}</p>
                </div>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kompetitor Serupa</p>
                <div v-for="c in mockCompetitors" :key="c.name" class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <span class="text-xs text-gray-700 dark:text-gray-300 font-medium truncate mr-2">{{ c.name }}</span>
                  <span class="text-xs font-bold text-emerald-600 shrink-0">Rp {{ c.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Stats Bar ── -->
    <section class="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <p class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ── Fitur ── -->
    <section id="fitur" class="py-24 bg-gray-50 dark:bg-gray-950">
      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <div class="text-center mb-14">
          <span
            class="inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 mb-4"
            >Fitur Utama</span
          >
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Semua yang kamu butuhkan</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">Platform lengkap untuk menganalisis dan meningkatkan daya saing produk UMKM Anda di pasar digital.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg hover:shadow-emerald-50 dark:hover:shadow-emerald-900/20 transition-all duration-200"
          >
            <div :class="`w-11 h-11 ${feat.bg} rounded-xl flex items-center justify-center mb-4`">
              <UIcon :name="feat.icon" :class="`w-5 h-5 ${feat.iconColor}`" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ feat.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Cara Kerja ── -->
    <section id="cara-kerja" class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-3xl mx-auto px-5 sm:px-8">
        <div class="text-center mb-14">
          <span
            class="inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 mb-4"
            >Cara Kerja</span
          >
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Mudah dalam 3 langkah</h2>
        </div>
        <div class="space-y-8">
          <div v-for="(step, idx) in steps" :key="step.title" class="flex gap-5">
            <div class="shrink-0">
              <div class="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
                {{ idx + 1 }}
              </div>
            </div>
            <div class="pt-2">
              <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">{{ step.title }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 28px 28px" />
      <div class="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4">Siap tingkatkan penjualan UMKM Anda?</h2>
        <p class="text-emerald-100/80 text-lg mb-8">Bergabunglah dan mulai analisis produk Anda menggunakan data pasar nyata.</p>
        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-700 font-bold text-base rounded-xl shadow-xl transition-all duration-150 hover:scale-[1.02]"
          @click="openAuth('register')"
        >
          <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5" />
          Mulai Sekarang — Gratis
        </button>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="bg-gray-900 dark:bg-gray-950 border-t border-gray-800 py-10">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar-square" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white text-sm">RadarUMKM<span class="text-emerald-400">Bogor</span></span>
        </div>
        <p class="text-gray-500 text-xs text-center">&copy; {{ new Date().getFullYear() }} RadarUMKMBogor &mdash; Mendukung UMKM Kota &amp; Kabupaten Bogor.</p>
      </div>
    </footer>

    <!-- ── Auth Modal ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false" />
          <div class="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-chart-bar-square" class="w-[15px] h-[15px] text-white" />
                </div>
                <span class="font-bold text-sm text-gray-900 dark:text-white">RadarUMKM<span class="text-emerald-600">Bogor</span></span>
              </div>
              <button class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="showModal = false">
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <div class="px-6 py-6">
              <!-- Tab Switcher -->
              <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                <button
                  class="flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200"
                  :class="activeTab === 'login' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                  @click="activeTab = 'login'"
                >
                  Masuk
                </button>
                <button
                  class="flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200"
                  :class="
                    activeTab === 'register' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  "
                  @click="activeTab = 'register'"
                >
                  Daftar
                </button>
              </div>

              <!-- Login Form -->
              <form v-if="activeTab === 'login'" class="space-y-4" @submit.prevent="handleLogin">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="email@contoh.com"
                    :disabled="loading"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <div class="relative">
                    <input
                      v-model="form.password"
                      :type="showLoginPassword ? 'text' : 'password'"
                      placeholder="Kata sandi Anda"
                      :disabled="loading"
                      class="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      @click="showLoginPassword = !showLoginPassword"
                    >
                      <UIcon :name="showLoginPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                >
                  <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  <UIcon v-else name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
                  {{ loading ? 'Memproses...' : 'Masuk ke Dashboard' }}
                </button>
              </form>

              <!-- Register Form -->
              <form v-else class="space-y-4" @submit.prevent="handleRegister">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                  <input
                    v-model="registerForm.name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    :disabled="loading"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    v-model="registerForm.email"
                    type="email"
                    placeholder="email@contoh.com"
                    :disabled="loading"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <div class="relative">
                    <input
                      v-model="registerForm.password"
                      :type="showRegisterPassword ? 'text' : 'password'"
                      placeholder="Min. 8 karakter"
                      :disabled="loading"
                      class="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      @click="showRegisterPassword = !showRegisterPassword"
                    >
                      <UIcon :name="showRegisterPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                >
                  <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  <UIcon v-else name="i-heroicons-user-plus" class="w-4 h-4" />
                  {{ loading ? 'Memproses...' : 'Buat Akun Gratis' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const toast = useToast();
const router = useRouter();
const colorMode = useColorMode();
const { loggedIn, fetch: fetchSession } = useUserSession();

// Redirect jika sudah login
onMounted(() => {
  if (loggedIn.value) {
    router.replace('/dashboard');
  }
});

const isDark = computed(() => colorMode.preference === 'dark' || (colorMode.preference === 'system' && colorMode.value === 'dark'));
const toggleDark = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark';
};

const scrolled = ref(false);
onMounted(() => {
  window.addEventListener(
    'scroll',
    () => {
      scrolled.value = window.scrollY > 20;
    },
    { passive: true },
  );
});
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const showModal = ref(false);
const activeTab = ref<'login' | 'register'>('login');
const loading = ref(false);
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const openAuth = (tab: 'login' | 'register') => {
  activeTab.value = tab;
  showModal.value = true;
};

const form = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  const t = toast.add({ title: 'Masuk...', description: 'Memverifikasi kredensial Anda', icon: 'i-heroicons-arrow-path', color: 'neutral' });
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: form.value });
    await fetchSession(); // refresh client-side session state
    toast.remove(t.id);
    toast.add({ title: 'Selamat datang! 👋', description: 'Anda berhasil masuk ke dashboard', color: 'success', icon: 'i-heroicons-check-circle' });
    showModal.value = false;
    await router.push('/dashboard');
  } catch (err: any) {
    toast.remove(t.id);
    toast.add({ title: 'Login Gagal', description: err?.data?.message || err.message, color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  const t = toast.add({ title: 'Mendaftarkan akun...', description: 'Membuat akun baru Anda', icon: 'i-heroicons-arrow-path', color: 'neutral' });
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: registerForm.value });
    toast.remove(t.id);
    toast.add({ title: '✅ Akun Berhasil Dibuat!', description: 'Silakan masuk dengan akun baru Anda', color: 'success', icon: 'i-heroicons-user-circle' });
    activeTab.value = 'login';
    form.value.email = registerForm.value.email;
    form.value.password = '';
    registerForm.value = { name: '', email: '', password: '' };
  } catch (err: any) {
    toast.remove(t.id);
    toast.add({ title: 'Registrasi Gagal', description: err?.data?.message || err.message, color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    loading.value = false;
  }
};

const navLinks = [
  { id: 'fitur', label: 'Fitur' },
  { id: 'cara-kerja', label: 'Cara Kerja' },
];

const mockStats = [
  { label: 'Harga Pasar', value: 'Rp 45rb' },
  { label: 'Rating Pasar', value: '4.6 ★' },
  { label: 'Total Terjual', value: '12.4k' },
];

const mockCompetitors = [
  { name: 'Lapis Talas Premium Bogor', price: '45.000' },
  { name: 'Kue Talas Original 250g', price: '38.000' },
  { name: 'Talas Bogor Spesial Gift Box', price: '72.000' },
];

const stats = [
  { value: '50K+', label: 'Data Produk' },
  { value: '3', label: 'Marketplace' },
  { value: '92%', label: 'Akurasi Model' },
  { value: '100+', label: 'Kategori Produk' },
];

const features = [
  {
    icon: 'i-heroicons-arrow-trending-up',
    title: 'Prediksi Daya Tarik',
    desc: 'Model Machine Learning menganalisis potensi produk Anda berdasarkan data penjualan riil pasar Bogor.',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: 'i-heroicons-light-bulb',
    title: 'Rekomendasi Strategis',
    desc: 'Dapatkan saran harga, strategi pemasaran, dan positioning produk berdasarkan analisis kompetitor.',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: 'i-heroicons-users',
    title: 'Analisis Kompetitor',
    desc: 'Bandingkan produk Anda dengan kompetitor terdekat dari Tokopedia, Shopee, dan Lazada.',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: 'Dashboard Insight',
    desc: 'Visualisasi data pasar secara real-time: distribusi harga, rating rata-rata, dan tren penjualan.',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Data Aman',
    desc: 'Setiap data produk Anda tersimpan aman dengan enkripsi dan autentikasi sesi yang ketat.',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    icon: 'i-heroicons-bookmark',
    title: 'Simpan Riwayat',
    desc: 'Simpan setiap analisis dan lacak perkembangan produk Anda dari waktu ke waktu.',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
];

const steps = [
  { title: 'Masukkan Data Produk', desc: 'Isi nama produk, kategori, harga yang ingin kamu jual, dan target rating produkmu.' },
  { title: 'AI Menganalisis Data Pasar', desc: 'Model Machine Learning membandingkan produkmu dengan ribuan data dari Tokopedia, Shopee, dan Lazada.' },
  { title: 'Dapatkan Insight & Strategi', desc: 'Lihat skor daya tarik, analisis kompetitor, dan rekomendasi strategis yang bisa langsung dieksekusi.' },
];
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
