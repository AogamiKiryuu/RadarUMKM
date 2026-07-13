<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 antialiased font-sans">

    <!-- ── Navbar ── -->
    <header
      class="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      :class="scrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50 border-b border-gray-100/60 dark:border-gray-800/60' : 'bg-transparent'"
    >
      <div class="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-6">
        <!-- Brand -->
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-emerald-900/50">
            <UIcon name="i-heroicons-chart-bar-square" class="w-[18px] h-[18px] text-white" />
          </div>
          <span class="font-bold text-gray-900 dark:text-white text-sm">RadarUMKM<span class="text-emerald-600">Bogor</span></span>
        </div>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-1 ml-4">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
            @click.prevent="scrollTo(link.id)"
          >{{ link.label }}</a>
        </nav>

        <!-- Right Side -->
        <div class="ml-auto flex items-center gap-2">
          <button class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="toggleDark">
            <UIcon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="w-5 h-5" />
          </button>
          <button class="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="openAuth('login')">Masuk</button>
          <button class="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 transition-all duration-200 hover:scale-[1.02]" @click="openAuth('register')">
            Daftar Gratis
          </button>
        </div>
      </div>
    </header>

    <!-- ── Hero ── -->
    <section id="hero" class="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <!-- Background Layers -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/20" />
      <!-- Grid pattern -->
      <div
        class="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style="background-image: linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px); background-size: 48px 48px"
      />
      <!-- Glow orbs -->
      <div class="absolute top-1/4 right-1/5 w-[500px] h-[500px] bg-emerald-300/15 dark:bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-1/4 left-1/5 w-[400px] h-[400px] bg-teal-200/15 dark:bg-teal-700/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <!-- Text Content -->
        <div>
          <div class="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-emerald-100 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Data real-time dari 3 marketplace terbesar Indonesia
          </div>
          <h1 class="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Prediksi Tren<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">Produk UMKM</span><br />
            dengan <span class="relative inline-block">AI
              <svg class="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,7 Q50,0 100,7" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              </svg>
            </span>
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
            Analisis daya tarik produk Anda berdasarkan data nyata dari Tokopedia, Shopee, dan Lazada — bukan sekadar tebakan.
          </p>

          <div class="flex flex-wrap gap-3 mb-10">
            <button
              class="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-xl shadow-emerald-200/60 dark:shadow-emerald-900/60 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
              @click="openAuth('register')"
            >
              <UIcon name="i-heroicons-rocket-launch" class="w-4 h-4" />
              Mulai Gratis Sekarang
            </button>
            <button
              class="inline-flex items-center gap-2 px-6 py-3.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md"
              @click="scrollTo('cara-kerja')"
            >
              Lihat Cara Kerja
              <UIcon name="i-heroicons-arrow-down" class="w-4 h-4" />
            </button>
          </div>

          <!-- Social Proof -->
          <div class="flex items-center gap-4">
            <div class="flex -space-x-2">
              <div v-for="i in 4" :key="i" :class="`w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 bg-gradient-to-br ${avatarGradients[i-1]} flex items-center justify-center text-white text-xs font-bold`">
                {{ avatarLetters[i-1] }}
              </div>
            </div>
            <div>
              <div class="flex text-amber-400 text-xs">★★★★★</div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Dipercaya ribuan UMKM Bogor</p>
            </div>
          </div>
        </div>

        <!-- App Mockup -->
        <div class="hidden lg:block">
          <div class="relative">
            <!-- Glow behind card -->
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-700/20 dark:to-teal-700/20 rounded-3xl blur-2xl scale-105" />
            <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-gray-200/80 dark:shadow-black/60 border border-gray-100/80 dark:border-gray-800 overflow-hidden">
              <!-- Titlebar -->
              <div class="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div class="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span class="ml-3 text-xs text-gray-400 font-medium">RadarUMKMBogor — Hasil Prediksi</span>
              </div>
              <div class="p-5 space-y-4">
                <!-- Score Card -->
                <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white relative overflow-hidden">
                  <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                  <p class="text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">Skor Daya Tarik</p>
                  <div class="flex items-end gap-2 mb-1">
                    <p class="text-5xl font-extrabold leading-none">83.4</p>
                    <span class="text-xl font-normal opacity-70 mb-1">%</span>
                  </div>
                  <p class="font-semibold text-sm mb-3">🌟 SANGAT MENARIK</p>
                  <div class="bg-white/20 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full bg-white w-[83%]" />
                  </div>
                </div>
                <!-- Price Context -->
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="m in mockPriceStats" :key="m.label" class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ m.value }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ m.label }}</p>
                  </div>
                </div>
                <!-- Competitors -->
                <div class="space-y-1.5">
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Produk Terpopuler di Kategori</p>
                  <div v-for="c in mockTopProducts" :key="c.name" class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors">
                    <div class="min-w-0">
                      <span class="text-xs text-gray-700 dark:text-gray-300 font-medium truncate block">{{ c.name }}</span>
                      <span class="text-[10px] text-amber-500">⭐ {{ c.rating }} · {{ c.sold }} terjual</span>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 shrink-0 ml-2">Rp {{ c.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Stats Bar ── -->
    <section class="border-y border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="stat in stats" :key="stat.label" class="text-center group">
          <p class="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ── Fitur ── -->
    <section id="fitur" class="py-24 bg-gray-50/50 dark:bg-gray-950">
      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <div class="text-center mb-14">
          <span class="inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 mb-4">Fitur Utama</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Semua yang kamu butuhkan</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">Platform lengkap untuk menganalisis dan meningkatkan daya saing produk UMKM Anda di pasar digital.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-transparent dark:hover:border-transparent hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden cursor-default"
          >
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" :style="`background: radial-gradient(circle at 0% 100%, ${feat.gradientColor}15, transparent 60%)`" />
            <div :class="`relative w-11 h-11 ${feat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`">
              <UIcon :name="feat.icon" :class="`w-5 h-5 ${feat.iconColor}`" />
            </div>
            <h3 class="relative font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{{ feat.title }}</h3>
            <p class="relative text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Cara Kerja ── -->
    <section id="cara-kerja" class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-3xl mx-auto px-5 sm:px-8">
        <div class="text-center mb-14">
          <span class="inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 mb-4">Cara Kerja</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Mudah dalam 3 langkah</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-3">Dari data produk ke insight bisnis dalam hitungan detik.</p>
        </div>
        <div class="space-y-0">
          <div v-for="(step, idx) in steps" :key="step.title" class="flex gap-5 relative">
            <!-- Connector line -->
            <div v-if="idx < steps.length - 1" class="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 to-transparent dark:from-emerald-800" />
            <div class="shrink-0 relative z-10">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-lg shadow-emerald-200/60 dark:shadow-emerald-900/60">
                {{ idx + 1 }}
              </div>
            </div>
            <div class="pt-2 pb-10">
              <div class="inline-flex items-center gap-2 mb-1">
                <h3 class="font-bold text-gray-900 dark:text-white text-base">{{ step.title }}</h3>
                <span class="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">{{ step.tag }}</span>
              </div>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="py-28 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700" />
      <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 28px 28px" />
      <div class="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div class="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <span class="inline-block bg-white/10 backdrop-blur-sm text-emerald-100 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 mb-6">Mulai Sekarang</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">Siap tingkatkan penjualan<br />UMKM Anda?</h2>
        <p class="text-emerald-100/80 text-lg mb-8 max-w-md mx-auto">Bergabunglah dan mulai analisis produk Anda menggunakan data pasar nyata Bogor.</p>
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            class="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-700 font-bold text-base rounded-xl shadow-2xl shadow-black/20 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
            @click="openAuth('register')"
          >
            <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5" />
            Mulai Gratis — Tanpa Kartu Kredit
          </button>
          <button
            class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-base rounded-xl border border-white/20 transition-all duration-200"
            @click="openAuth('login')"
          >
            Sudah punya akun? Masuk
          </button>
        </div>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="bg-gray-900 dark:bg-gray-950 border-t border-gray-800 py-12">
      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-chart-bar-square" class="w-4 h-4 text-white" />
            </div>
            <span class="font-bold text-white text-sm">RadarUMKM<span class="text-emerald-400">Bogor</span></span>
          </div>
          <p class="text-gray-500 text-xs text-center">&copy; {{ new Date().getFullYear() }} RadarUMKMBogor &mdash; Mendukung UMKM Kota &amp; Kabupaten Bogor.</p>
          <div class="flex items-center gap-4">
            <span class="text-xs text-gray-600">Powered by</span>
            <span class="text-xs font-semibold text-gray-400">Random Forest v3</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- ── Auth Modal ── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showModal = false" />
          <div class="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
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
                >Masuk</button>
                <button
                  class="flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200"
                  :class="activeTab === 'register' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                  @click="activeTab = 'register'"
                >Daftar</button>
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
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="showLoginPassword = !showLoginPassword">
                      <UIcon :name="showLoginPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button type="submit" :disabled="loading" class="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
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
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" @click="showRegisterPassword = !showRegisterPassword">
                      <UIcon :name="showRegisterPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button type="submit" :disabled="loading" class="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
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

onMounted(() => {
  if (loggedIn.value) router.replace('/dashboard');
});

const isDark = computed(() => colorMode.preference === 'dark' || (colorMode.preference === 'system' && colorMode.value === 'dark'));
const toggleDark = () => { colorMode.preference = isDark.value ? 'light' : 'dark'; };

const scrolled = ref(false);
onMounted(() => {
  window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 20; }, { passive: true });
});
const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

const showModal = ref(false);
const activeTab = ref<'login' | 'register'>('login');
const loading = ref(false);
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const openAuth = (tab: 'login' | 'register') => { activeTab.value = tab; showModal.value = true; };

const form = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  const t = toast.add({ title: 'Masuk...', description: 'Memverifikasi kredensial Anda', icon: 'i-heroicons-arrow-path', color: 'neutral' });
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: form.value });
    await fetchSession();
    toast.remove(t.id);
    toast.add({ title: 'Selamat datang! 👋', description: 'Anda berhasil masuk ke dashboard', color: 'success', icon: 'i-heroicons-check-circle' });
    showModal.value = false;
    await router.push('/dashboard');
  } catch (err: any) {
    toast.remove(t.id);
    toast.add({ title: 'Login Gagal', description: err?.data?.message || err.message, color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally { loading.value = false; }
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
  } finally { loading.value = false; }
};

const navLinks = [
  { id: 'fitur', label: 'Fitur' },
  { id: 'cara-kerja', label: 'Cara Kerja' },
];

const avatarGradients = ['from-emerald-400 to-teal-500', 'from-violet-400 to-purple-500', 'from-blue-400 to-indigo-500', 'from-orange-400 to-rose-500'];
const avatarLetters = ['A', 'B', 'C', 'D'];

const mockPriceStats = [
  { label: 'Segmen Harga', value: 'Menengah' },
  { label: 'Median Pasar', value: 'Rp 45rb' },
  { label: 'Selisih', value: '-12%' },
];

const mockTopProducts = [
  { name: 'Lapis Talas Premium Bogor', rating: '4.9', sold: '1.2k', price: '45.000' },
  { name: 'Kue Talas Original 250g', rating: '4.7', sold: '890', price: '38.000' },
  { name: 'Talas Bogor Spesial Gift Box', rating: '4.8', sold: '540', price: '72.000' },
];

const stats = [
  { value: '1.027+', label: 'Data Produk Terverifikasi' },
  { value: '3', label: 'Marketplace Terintegrasi' },
  { value: '92%', label: 'Akurasi Model ML' },
  { value: '6', label: 'Kota/Kabupaten Tercover' },
];

const features = [
  {
    icon: 'i-heroicons-arrow-trending-up',
    title: 'Prediksi Daya Tarik',
    desc: 'Model Random Forest v3 menganalisis potensi produk berdasarkan data penjualan riil pasar Bogor.',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    gradientColor: '#10b981',
  },
  {
    icon: 'i-heroicons-banknotes',
    title: 'Analisis Posisi Harga',
    desc: 'Bandingkan harga Anda vs median pasar per kategori — tahu apakah harga terlalu mahal atau kompetitif.',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    gradientColor: '#3b82f6',
  },
  {
    icon: 'i-heroicons-fire',
    title: 'Produk Paling Digemari',
    desc: 'Lihat top 5 produk terlaris di kategorimu berdasarkan skor popularitas gabungan rating dan penjualan.',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    gradientColor: '#f43f5e',
  },
  {
    icon: 'i-heroicons-globe-alt',
    title: 'Insight Pasar Keseluruhan',
    desc: 'Ranking semua kategori produk — tahu posisi kategorimu dibanding kompetitor di pasar Bogor.',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    gradientColor: '#8b5cf6',
  },
  {
    icon: 'i-heroicons-map-pin',
    title: 'Segmen per Lokasi',
    desc: 'Filter produk teratas berdasarkan kota — Bogor, Jakarta, Bekasi, Depok, Tangerang, dan lainnya.',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    gradientColor: '#14b8a6',
  },
  {
    icon: 'i-heroicons-users',
    title: 'Analisis Kompetitor',
    desc: 'Cosine similarity menemukan produk serupa dari dataset nyata — bandingkan harga, rating, dan penjualan.',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    gradientColor: '#f97316',
  },
];

const steps = [
  {
    title: 'Masukkan Data Produk',
    tag: 'Input',
    desc: 'Isi nama produk yang mengandung identitas Bogor, pilih kategori, sub-kategori, dan harga jual Anda.',
  },
  {
    title: 'AI Menganalisis Pasar',
    tag: 'Proses',
    desc: 'Model ML v3 mencari kompetitor serupa via TF-IDF, menghitung posisi harga, dan memprediksi daya tarik produk.',
  },
  {
    title: 'Dapatkan Insight Lengkap',
    tag: 'Hasil',
    desc: 'Lihat skor prediksi, posisi harga vs pasar, produk terpopuler di kategorimu, dan ranking pasar keseluruhan.',
  },
];
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
