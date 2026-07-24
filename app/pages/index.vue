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
                  <p class="font-semibold text-sm mb-3 flex items-center gap-1"><UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-emerald-300" /> SANGAT MENARIK</p>
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
                      <span class="text-[10px] text-amber-500 flex items-center gap-0.5"><UIcon name="i-heroicons-star-solid" class="w-3 h-3" /> {{ c.rating }} · {{ c.sold }} terjual</span>
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

    <!-- ── Cara Kerja AI ── -->
    <section id="cara-kerja-ai" class="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px); background-size: 40px 40px" />
      <div class="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <!-- Header -->
        <div class="text-center mb-14">
          <span class="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Transparansi AI</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Bagaimana AI Menghitung
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Probabilitas?</span>
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Bukan “kotak hitam” — setiap angka prediksi memiliki dasar matematis yang jelas. Klik setiap tab untuk memahami cara kerjanya secara mendalam.
          </p>
        </div>

        <!-- Tab Navigation -->
        <div class="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            v-for="tab in aiTabs"
            :key="tab.id"
            @click="activeAiTab = tab.id"
            :class="[
              activeAiTab === tab.id
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-900/20'
                : 'border-gray-300 dark:border-gray-700/50 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-transparent',
              'px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 flex items-center gap-2 whitespace-nowrap'
            ]"
          >
            <UIcon :name="tab.icon" class="w-5 h-5" />
            <span>{{ tab.label }}</span>
            <span v-if="activeAiTab === tab.id" class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          </button>
        </div>

        <!-- Tab Panels -->
        <Transition name="tab-fade" mode="out-in">
          <div :key="activeAiTab">

            <!-- Panel TF-IDF -->
            <div v-if="activeAiTab === 'tfidf'" class="grid lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500/60" /><div class="w-3 h-3 rounded-full bg-yellow-500/60" /><div class="w-3 h-3 rounded-full bg-green-500/60" />
                    <span class="ml-2 text-xs text-gray-500 font-mono">tfidf_cosine.math</span>
                  </div>
                  <div class="p-5 space-y-5 font-mono text-sm">
                    <div>
                      <p class="text-gray-500 text-[11px] mb-2.5">// 1. Term Frequency — frekuensi kata dalam nama produk</p>
                      <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                        <span class="text-emerald-400">TF</span><span class="text-gray-400">(t, d)</span>
                        <span class="text-gray-500">=</span>
                        <div class="inline-flex flex-col items-center">
                          <span class="text-amber-400 text-xs border-b border-gray-600 px-3 pb-1">frekuensi(t, d)</span>
                          <span class="text-blue-400 text-xs pt-1">Σ frekuensi semua kata</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-500 text-[11px] mb-2.5">// 2. Inverse Document Frequency — keunikan kata di dataset</p>
                      <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                        <span class="text-emerald-400">IDF</span><span class="text-gray-400">(t)</span>
                        <span class="text-gray-500">=</span>
                        <span class="text-white">log</span>
                        <div class="inline-flex flex-col items-center mx-1">
                          <span class="text-amber-400 text-xs border-b border-gray-600 px-2 pb-1">N (total produk)</span>
                          <span class="text-blue-400 text-xs pt-1">df(t) (produk mengandung t)</span>
                        </div>
                        <span class="text-gray-500">+ 1</span>
                      </div>
                    </div>
                    <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                      <p class="text-gray-500 text-[11px] mb-2">// 3. Skor bobot akhir per kata</p>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-emerald-400 font-bold">TF-IDF</span><span class="text-gray-400">(t, d)</span>
                        <span class="text-gray-500">=</span>
                        <span class="text-amber-400">TF(t, d)</span>
                        <span class="text-gray-400">×</span>
                        <span class="text-blue-400">IDF(t)</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-500 text-[11px] mb-2.5">// 4. Kemiripan antar dua vektor produk (Cosine Similarity)</p>
                      <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                        <span class="text-violet-400">sim</span><span class="text-gray-400">(A, B)</span>
                        <span class="text-gray-500">=</span>
                        <div class="inline-flex flex-col items-center mx-1">
                          <span class="text-amber-400 text-xs border-b border-gray-600 px-3 pb-1">A · B</span>
                          <span class="text-blue-400 text-xs pt-1">‖A‖ × ‖B‖</span>
                        </div>
                        <span class="text-gray-500">∈ [0, 1]</span>
                      </div>
                    </div>
                    <p class="text-[10px] text-gray-600 leading-relaxed">Hasil berupa vektor numerik yang merepresentasikan nama produk. Cosine similarity digunakan untuk mencari K produk paling mirip dari dataset sebagai referensi fitur.</p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5"><UIcon name="i-heroicons-beaker" class="w-4 h-4 text-gray-500" /> Demo Tokenisasi Interaktif</h4>
                  <p class="text-xs text-gray-500 mb-4">Ketik nama produk untuk melihat bagaimana AI memecah dan menimbang setiap kata.</p>
                  <input
                    v-model="demoProduct"
                    type="text"
                    placeholder="contoh: Lapis Talas Bogor"
                    class="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 transition mb-4"
                  />
                  <div class="space-y-2.5">
                    <p class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Bobot TF-IDF per Kata:</p>
                    <div v-if="demoTokens.length > 0" class="space-y-2">
                      <div v-for="token in demoTokens" :key="token.token" class="flex items-center gap-3">
                        <span class="font-mono text-xs text-emerald-400 w-28 shrink-0 truncate">“{{ token.token }}”</span>
                        <div class="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div class="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" :style="`width: ${token.score}%`" />
                        </div>
                        <span class="text-xs text-gray-400 font-mono w-10 text-right">{{ token.score.toFixed(0) }}%</span>
                      </div>
                    </div>
                    <p v-else class="text-xs text-gray-600 italic">Ketik nama produk di atas...</p>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <p class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Produk Paling Mirip (Cosine Similarity):</p>
                  <div v-if="demoMatches.length > 0" class="space-y-2">
                    <div v-for="match in demoMatches" :key="match.name" class="flex items-center justify-between bg-gray-100 dark:bg-gray-800/60 rounded-xl px-3 py-2.5">
                      <span class="text-xs text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{{ match.name }}</span>
                      <div class="flex items-center gap-2 shrink-0">
                        <div class="w-16 bg-gray-300 dark:bg-gray-700 rounded-full h-1.5">
                          <div class="h-1.5 rounded-full bg-violet-500 transition-all duration-500" :style="`width: ${match.sim}%`" />
                        </div>
                        <span class="text-xs font-bold text-violet-400 w-8 text-right">{{ match.sim }}%</span>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-600 italic">Hasil kemiripan akan muncul di sini...</p>
                </div>
              </div>
            </div>

            <!-- Panel Random Forest -->
            <div v-else-if="activeAiTab === 'rf'" class="grid lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500/60" /><div class="w-3 h-3 rounded-full bg-yellow-500/60" /><div class="w-3 h-3 rounded-full bg-green-500/60" />
                    <span class="ml-2 text-xs text-gray-500 font-mono">random_forest.math</span>
                  </div>
                  <div class="p-5 space-y-5 font-mono text-sm">
                    <div>
                      <p class="text-gray-500 text-[11px] mb-2.5">// Setiap pohon keputusan melakukan prediksi independen</p>
                      <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                        <span class="text-amber-400">h<sub class="text-[9px]">n</sub></span><span class="text-gray-400">(x)</span>
                        <span class="text-gray-500">=</span>
                        <span class="text-gray-300">prediksi pohon ke-n</span>
                        <span class="text-gray-500">∈ {&quot;Laku&quot;, &quot;Tidak&quot;}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-500 text-[11px] mb-2.5">// Probabilitas produk akan &quot;Laku&quot; (voting mayoritas)</p>
                      <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                        <span class="text-emerald-400">P</span><span class="text-gray-400">(Laku | x)</span>
                        <span class="text-gray-500">=</span>
                        <div class="inline-flex flex-col items-center mx-1">
                          <span class="text-amber-400 text-xs border-b border-gray-600 px-2 pb-1">Σ<sub>n</sub> 𝟙[h<sub>n</sub>(x) = &quot;Laku&quot;]</span>
                          <span class="text-blue-400 text-xs pt-1">N (total pohon)</span>
                        </div>
                      </div>
                    </div>
                    <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                      <p class="text-gray-500 text-[11px] mb-2">// Konversi ke skala 0–100</p>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-emerald-400 font-bold">Skor</span>
                        <span class="text-gray-500">=</span>
                        <span class="text-white">P</span><span class="text-gray-400">(Laku | x)</span>
                        <span class="text-gray-500">× 100</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-500 text-[11px] mb-2">// Fitur input model Random Forest v3:</p>
                      <div class="space-y-1.5">
                        <div v-for="f in rfFeatures" :key="f.name" class="flex items-center gap-2 text-xs">
                          <span class="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                          <span class="text-gray-300 font-mono">{{ f.name }}</span>
                          <span class="ml-auto text-gray-600">{{ f.type }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                  <p class="text-xs text-amber-300 font-semibold mb-1.5">Mengapa Random Forest?</p>
                  <p class="text-xs text-gray-400 leading-relaxed">Menggabungkan banyak pohon sederhana (bootstrap sampling) untuk hasil lebih akurat dan tahan terhadap overfitting dibanding model tunggal.</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5"><UIcon name="i-heroicons-inbox-arrow-down" class="w-4 h-4 text-gray-500" /> Simulasi Voting Pohon</h4>
                  <p class="text-xs text-gray-500 mb-4">Klik pohon untuk <span class="text-emerald-400 font-semibold">toggle vote-nya</span> dan lihat bagaimana probabilitas berubah secara real-time.</p>
                  <div class="grid grid-cols-5 gap-2 mb-4">
                    <button
                      v-for="tree in rfTrees"
                      :key="tree.id"
                      @click="toggleTreeVote(tree.id)"
                      :class="[
                        selectedTree === tree.id ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 scale-105 shadow-lg' : 'hover:scale-105',
                        tree.vote === 'laku' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30',
                        selectedTree === tree.id && tree.vote === 'laku' ? 'ring-emerald-500' : '',
                        selectedTree === tree.id && tree.vote !== 'laku' ? 'ring-red-500' : '',
                      ]"
                      class="border rounded-xl p-2.5 transition-all duration-200 flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                      <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 mb-1 transition-colors" :class="tree.vote === 'laku' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'" />
                      <span class="text-[10px] font-bold flex items-center gap-0.5" :class="tree.vote === 'laku' ? 'text-emerald-400' : 'text-red-400'">
                        <UIcon :name="tree.vote === 'laku' ? 'i-heroicons-check' : 'i-heroicons-x-mark'" class="w-3 h-3" /> {{ tree.vote === 'laku' ? 'Laku' : 'Tidak' }}
                      </span>
                      <span class="text-[9px] text-gray-600">Pohon {{ tree.id }}</span>
                    </button>
                  </div>
                  <Transition name="tab-fade" mode="out-in">
                    <div v-if="selectedTree !== null" :key="selectedTree" class="bg-gray-100 dark:bg-gray-800/60 rounded-xl p-3 mb-4">
                      <p class="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Pohon {{ selectedTree }} — Fitur yang Dipertimbangkan:</p>
                      <div class="space-y-1">
                        <div v-for="f in rfTrees.find(t => t.id === selectedTree)?.features" :key="f" class="flex items-center gap-2">
                          <span class="w-1 h-1 rounded-full bg-teal-400 shrink-0" />
                          <span class="text-xs text-gray-400">{{ f }}</span>
                        </div>
                      </div>
                    </div>
                  </Transition>
                  <div class="bg-gray-100 dark:bg-gray-800/40 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs text-gray-400">Hasil Voting:</span>
                      <span class="text-sm font-bold font-mono" :class="rfVoteLaku >= Math.ceil(rfTrees.length / 2) ? 'text-emerald-400' : 'text-red-400'">
                        P(Laku) = {{ rfVoteLaku }}/{{ rfTrees.length }} = {{ (rfVoteLaku / rfTrees.length * 100).toFixed(0) }}%
                      </span>
                    </div>
                    <div class="flex gap-1 mb-2">
                      <div
                        v-for="tree in rfTrees"
                        :key="tree.id"
                        class="flex-1 h-4 rounded transition-all duration-300"
                        :class="tree.vote === 'laku' ? 'bg-emerald-500' : 'bg-red-500/50'"
                      />
                    </div>
                    <div class="flex justify-between">
                      <span class="text-[10px] text-emerald-400 flex items-center gap-0.5">{{ rfVoteLaku }} Laku <UIcon name="i-heroicons-check" class="w-3 h-3" /></span>
                      <span class="text-[10px] text-red-400 flex items-center gap-0.5">{{ rfTrees.length - rfVoteLaku }} Tidak <UIcon name="i-heroicons-x-mark" class="w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel Analisis Harga -->
            <div v-else-if="activeAiTab === 'harga'" class="grid lg:grid-cols-2 gap-6">
              <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500/60" /><div class="w-3 h-3 rounded-full bg-yellow-500/60" /><div class="w-3 h-3 rounded-full bg-green-500/60" />
                  <span class="ml-2 text-xs text-gray-500 font-mono">price_context.math</span>
                </div>
                <div class="p-5 space-y-5 font-mono text-sm">
                  <div>
                    <p class="text-gray-500 text-[11px] mb-2.5">// Median harga dari produk kompetitor sekategori</p>
                    <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                      <span class="text-blue-400">M</span>
                      <span class="text-gray-500">=</span>
                      <span class="text-gray-300">median</span>
                      <span class="text-gray-400">({ harga kompetitor di kategori })</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-gray-500 text-[11px] mb-2.5">// Selisih harga relatif terhadap pasar</p>
                    <div class="flex items-center gap-2 flex-wrap bg-gray-800/40 rounded-xl p-3">
                      <span class="text-emerald-400">δ</span>
                      <span class="text-gray-500">=</span>
                      <div class="inline-flex flex-col items-center mx-1">
                        <span class="text-amber-400 text-xs border-b border-gray-600 px-3 pb-1">H<sub>input</sub> − M</span>
                        <span class="text-blue-400 text-xs pt-1">M</span>
                      </div>
                      <span class="text-gray-500">× 100%</span>
                    </div>
                  </div>
                  <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2.5">
                    <p class="text-gray-500 text-[11px] mb-1">// Segmentasi risiko berdasarkan δ:</p>
                    <div class="flex items-center gap-2">
                      <span class="text-emerald-400 text-xs font-mono w-32">δ &lt; −20%</span>
                      <span class="text-gray-600">→</span>
                      <span class="px-2 py-0.5 bg-emerald-500/10 rounded text-emerald-300 text-xs font-semibold">Ekonomis</span>
                      <span class="text-gray-600 text-[10px]">(lebih kompetitif)</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-amber-400 text-xs font-mono w-32">−20% ≤ δ ≤ +20%</span>
                      <span class="text-gray-600">→</span>
                      <span class="px-2 py-0.5 bg-amber-500/10 rounded text-amber-300 text-xs font-semibold">Menengah</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-400 text-xs font-mono w-32">δ &gt; +20%</span>
                      <span class="text-gray-600">→</span>
                      <span class="px-2 py-0.5 bg-red-500/10 rounded text-red-300 text-xs font-semibold">Mahal</span>
                      <span class="text-gray-600 text-[10px]">(risiko tinggi)</span>
                    </div>
                  </div>
                  <p class="text-[10px] text-gray-600 leading-relaxed">Harga bukan satu-satunya faktor, tapi produk dengan harga jauh di atas median pasar cenderung memiliki peluang laku lebih rendah tanpa diferensiasi yang kuat.</p>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5"><UIcon name="i-heroicons-calculator" class="w-4 h-4 text-gray-500" /> Kalkulator Posisi Harga</h4>
                <p class="text-xs text-gray-500 mb-5">Geser slider untuk melihat δ dan segmen risiko produkmu vs pasar secara real-time.</p>
                <div class="space-y-5 mb-6">
                  <div>
                    <div class="flex justify-between mb-2">
                      <label class="text-xs text-gray-400">Harga Produk Anda (H<sub>input</sub>)</label>
                      <span class="text-sm font-bold text-gray-900 dark:text-white font-mono">Rp {{ calcHargaUser.toLocaleString('id-ID') }}</span>
                    </div>
                    <input type="range" v-model.number="calcHargaUser" min="10000" max="200000" step="1000" class="w-full accent-emerald-500 cursor-pointer" />
                    <div class="flex justify-between mt-1 text-[10px] text-gray-600"><span>Rp 10.000</span><span>Rp 200.000</span></div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-2">
                      <label class="text-xs text-gray-400">Median Pasar Kategorimu (M)</label>
                      <span class="text-sm font-bold text-blue-400 font-mono">Rp {{ calcMedianPasar.toLocaleString('id-ID') }}</span>
                    </div>
                    <input type="range" v-model.number="calcMedianPasar" min="10000" max="200000" step="1000" class="w-full accent-blue-500 cursor-pointer" />
                    <div class="flex justify-between mt-1 text-[10px] text-gray-600"><span>Rp 10.000</span><span>Rp 200.000</span></div>
                  </div>
                </div>
                <div
                  class="border rounded-2xl p-4 transition-all duration-300"
                  :class="priceSegmen === 'Ekonomis' ? 'bg-emerald-500/10 border-emerald-500/20' : priceSegmen === 'Mahal' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <p class="text-[10px] text-gray-500 uppercase tracking-wide">Selisih (δ)</p>
                      <p class="text-3xl font-extrabold mt-0.5 font-mono transition-colors duration-300"
                        :class="priceSegmen === 'Ekonomis' ? 'text-emerald-400' : priceSegmen === 'Mahal' ? 'text-red-400' : 'text-amber-400'"
                      >{{ priceDiffPercent > 0 ? '+' : '' }}{{ priceDiffPercent.toFixed(1) }}%</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] text-gray-500 uppercase tracking-wide">Segmen Risiko</p>
                      <p class="text-xl font-bold mt-0.5 transition-colors duration-300"
                        :class="priceSegmen === 'Ekonomis' ? 'text-emerald-400' : priceSegmen === 'Mahal' ? 'text-red-400' : 'text-amber-400'"
                      >{{ priceSegmen }}</p>
                    </div>
                  </div>
                  <div class="relative mb-2">
                    <div class="bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        class="h-3 rounded-full transition-all duration-300"
                        :class="priceSegmen === 'Ekonomis' ? 'bg-emerald-500' : priceSegmen === 'Mahal' ? 'bg-red-500' : 'bg-amber-500'"
                        :style="`width: ${Math.min(100, Math.max(3, (calcHargaUser / 200000) * 100))}%`"
                      />
                    </div>
                    <div class="absolute top-0 h-3 w-0.5 bg-gray-500/50 dark:bg-white/40" :style="`left: ${Math.min(99, Math.max(1, (calcMedianPasar / 200000) * 100))}%`" />
                  </div>
                  <div class="flex justify-between text-[10px] text-gray-600">
                    <span>← Lebih murah</span><span class="text-gray-400 dark:text-white/30">│ median</span><span>Lebih mahal →</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel Skor Akhir -->
            <div v-else-if="activeAiTab === 'final'" class="grid lg:grid-cols-2 gap-6">
              <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500/60" /><div class="w-3 h-3 rounded-full bg-yellow-500/60" /><div class="w-3 h-3 rounded-full bg-green-500/60" />
                  <span class="ml-2 text-xs text-gray-500 font-mono">final_score.math</span>
                </div>
                <div class="p-5 font-mono text-sm space-y-4">
                  <p class="text-gray-500 text-[11px]">// Pipeline lengkap sistem prediksi RadarUMKM:</p>
                  <div class="space-y-2.5">
                    <div v-for="(step, i) in pipelineFormula" :key="i" class="flex items-start gap-3 bg-gray-800/40 rounded-xl p-3">
                      <span class="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5" :class="step.bg + ' ' + step.textColor">{{ i + 1 }}</span>
                      <div>
                        <p class="text-xs" :class="step.textColor">{{ step.code }}</p>
                        <p class="text-[10px] text-gray-600 mt-0.5">{{ step.desc }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <p class="text-gray-500 text-[11px] mb-2">// Output akhir yang ditampilkan ke pengguna</p>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-emerald-400 font-bold">Skor_Akhir</span>
                      <span class="text-gray-500">=</span>
                      <span class="text-white">P</span><span class="text-gray-400">(Laku | x)</span>
                      <span class="text-gray-500">× 100</span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <p class="text-gray-500 text-[11px]">// Interpretasi skor hasil:</p>
                    <div v-for="thresh in scoreThresholds" :key="thresh.label" class="flex items-center gap-2 text-xs">
                      <div class="w-8 h-1.5 rounded-full shrink-0" :class="thresh.barColor" />
                      <span class="font-mono" :class="thresh.textColor">{{ thresh.range }}</span>
                      <span class="text-gray-600">→</span>
                      <span class="text-gray-300 flex items-center gap-1">
                        {{ thresh.label }}
                        <UIcon :name="thresh.icon" :class="thresh.textColor" class="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4">Alur Prediksi Visual</h4>
                  <div class="space-y-2">
                    <div v-for="(step, i) in pipelineSteps" :key="i" class="flex items-center gap-3 p-2.5 bg-gray-100 dark:bg-gray-800/40 rounded-xl">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="step.bg"><UIcon :name="step.icon" class="w-5 h-5 text-white/80" /></div>
                      <div class="flex-1">
                        <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ step.title }}</p>
                        <p class="text-[10px] text-gray-500">{{ step.desc }}</p>
                      </div>
                      <UIcon v-if="i < pipelineSteps.length - 1" name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-700 shrink-0" />
                      <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                  </div>
                </div>
                <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                  <p class="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><UIcon name="i-heroicons-chart-bar" class="w-4 h-4" /> Spesifikasi Model</p>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-100 dark:bg-gray-900/60 rounded-xl p-3 text-center"><p class="text-2xl font-extrabold text-gray-900 dark:text-white">≥92%</p><p class="text-[10px] text-gray-500 mt-0.5">Akurasi Validasi</p></div>
                    <div class="bg-gray-100 dark:bg-gray-900/60 rounded-xl p-3 text-center"><p class="text-2xl font-extrabold text-gray-900 dark:text-white">1.027+</p><p class="text-[10px] text-gray-500 mt-0.5">Data Training</p></div>
                    <div class="bg-gray-100 dark:bg-gray-900/60 rounded-xl p-3 text-center"><p class="text-2xl font-extrabold text-gray-900 dark:text-white">3</p><p class="text-[10px] text-gray-500 mt-0.5">Marketplace Sumber</p></div>
                    <div class="bg-gray-100 dark:bg-gray-900/60 rounded-xl p-3 text-center"><p class="text-2xl font-extrabold text-gray-900 dark:text-white">v3</p><p class="text-[10px] text-gray-500 mt-0.5">Versi Model RF</p></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Transition>

        <!-- Live Calculator -->
        <div class="mt-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50 dark:bg-gray-900">
            <div class="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0"><UIcon name="i-heroicons-calculator" class="w-5 h-5 text-emerald-500" /></div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Kalkulator Skor Interaktif</h3>
              <p class="text-xs text-gray-500">Geser slider dan lihat skor prediksi berubah secara real-time</p>
            </div>
          </div>
          <div class="p-5 grid md:grid-cols-2 gap-8 items-start">
            <div class="space-y-6">
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-xs text-gray-400">Kemiripan Nama dengan Top Seller</label>
                  <span class="text-sm font-bold text-emerald-400 font-mono">{{ calcSimilarity }}%</span>
                </div>
                <input type="range" v-model.number="calcSimilarity" min="0" max="100" class="w-full accent-emerald-500 cursor-pointer" />
                <p class="text-[10px] text-gray-600 mt-1">Semakin mirip nama dengan produk populer → bobot TF-IDF lebih tinggi → fitur RF lebih kuat</p>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-xs text-gray-400">Popularitas Kategori &amp; Sub-Kategori</label>
                  <span class="text-sm font-bold text-blue-400 font-mono">{{ calcPopularity }}%</span>
                </div>
                <input type="range" v-model.number="calcPopularity" min="0" max="100" class="w-full accent-blue-500 cursor-pointer" />
                <p class="text-[10px] text-gray-600 mt-1">Volume penjualan kategori di pasar Bogor relatif terhadap semua kategori</p>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-xs text-gray-400">Selisih Harga vs Median Pasar (δ)</label>
                  <span class="text-sm font-bold font-mono" :class="calcPriceDiff > 20 ? 'text-red-400' : calcPriceDiff < -20 ? 'text-emerald-400' : 'text-amber-400'">
                    {{ calcPriceDiff > 0 ? '+' : '' }}{{ calcPriceDiff }}%
                  </span>
                </div>
                <input type="range" v-model.number="calcPriceDiff" min="-50" max="100" class="w-full accent-amber-500 cursor-pointer" />
                <p class="text-[10px] text-gray-600 mt-1">Negatif = lebih murah dari pasar (kompetitif) · Positif = lebih mahal (risiko)</p>
              </div>
            </div>
            <div>
              <div
                class="border rounded-2xl p-6 text-center transition-all duration-300"
                :class="calcFinalScore >= 70 ? 'bg-emerald-500/10 border-emerald-500/20' : calcFinalScore >= 40 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'"
              >
                <p class="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Estimasi Skor Prediksi</p>
                <div class="flex items-end justify-center gap-1 mb-2">
                  <span class="text-6xl font-extrabold transition-colors duration-300 font-mono"
                    :class="calcFinalScore >= 70 ? 'text-emerald-400' : calcFinalScore >= 40 ? 'text-amber-400' : 'text-red-400'"
                  >{{ calcFinalScore.toFixed(1) }}</span>
                  <span class="text-2xl text-gray-600 mb-2">%</span>
                </div>
                <p class="text-sm font-bold mb-4 flex items-center justify-center gap-1.5"
                  :class="calcFinalScore >= 70 ? 'text-emerald-300' : calcFinalScore >= 40 ? 'text-amber-300' : 'text-red-300'"
                >
                  <UIcon :name="calcFinalScore >= 70 ? 'i-heroicons-star-solid' : calcFinalScore >= 40 ? 'i-heroicons-check-circle-solid' : 'i-heroicons-exclamation-triangle-solid'" class="w-5 h-5" />
                  {{ calcFinalScore >= 70 ? 'SANGAT MENARIK' : calcFinalScore >= 40 ? 'CUKUP MENARIK' : 'KURANG MENARIK' }}
                </p>
                <div class="bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden mb-4">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="calcFinalScore >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : calcFinalScore >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-rose-500'"
                    :style="`width: ${calcFinalScore}%`"
                  />
                </div>
                <div class="text-left bg-gray-100 dark:bg-gray-800/60 rounded-xl p-3 space-y-1.5 text-xs font-mono">
                  <div class="flex justify-between text-gray-400">
                    <span class="text-emerald-400">RF_prob</span><span>= {{ calcRfProb.toFixed(3) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-400">
                    <span class="text-amber-400">price_adj</span><span>= × {{ calcPriceAdjustment.toFixed(2) }}</span>
                  </div>
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-1.5 flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Skor_Akhir</span><span>= {{ calcFinalScore.toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
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
        <div v-if="showModal" class="fixed inset-0 z-[50] flex items-center justify-center p-4">
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
  { id: 'cara-kerja-ai', label: 'Cara Kerja AI' },
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

// ── Cara Kerja AI ────────────────────────────────────────────────────────────────────────────
const activeAiTab = ref('tfidf');

const aiTabs = [
  { id: 'tfidf', icon: 'i-heroicons-magnifying-glass', label: 'TF-IDF & Cosine' },
  { id: 'rf', icon: 'i-heroicons-cpu-chip', label: 'Random Forest' },
  { id: 'harga', icon: 'i-heroicons-currency-dollar', label: 'Analisis Harga' },
  { id: 'final', icon: 'i-heroicons-chart-bar', label: 'Skor Akhir' },
];

// TF-IDF Demo
const demoProduct = ref('Lapis Talas Bogor');
const tokenWeights: Record<string, number> = {
  lapis: 83, talas: 91, bogor: 88, kue: 74, snack: 71, kopi: 85,
  batik: 78, keripik: 76, dodol: 83, original: 62, premium: 68,
  tradisional: 79, spesial: 65, homemade: 72, roti: 69, minuman: 66,
  pakaian: 75, aksesoris: 70, souvenir: 73, coklat: 77, susu: 64,
};
const demoTokens = computed(() => {
  const words = demoProduct.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return words.map((token) => ({
    token,
    score: tokenWeights[token] ?? Math.min(90, Math.max(35, 40 + ((token.charCodeAt(0) + token.length * 7) % 48))),
  }));
});
const demoMatches = computed(() => {
  if (!demoProduct.value.trim() || demoTokens.value.length === 0) return [];
  const avg = demoTokens.value.reduce((s, t) => s + t.score, 0) / demoTokens.value.length;
  return [
    { name: `${demoProduct.value} Original 250g`, sim: Math.min(97, Math.floor(avg + 5)) },
    { name: `${demoProduct.value} Premium Box`, sim: Math.min(92, Math.floor(avg - 4)) },
    { name: `${demoProduct.value} Spesial Gift`, sim: Math.min(87, Math.floor(avg - 10)) },
    { name: `${demoProduct.value} Mini Pack`, sim: Math.min(80, Math.floor(avg - 17)) },
  ].filter(m => m.sim > 20).sort((a, b) => b.sim - a.sim);
});

// Random Forest
const rfTrees = ref([
  { id: 1, vote: 'laku', features: ['Kemiripan nama: 78%', 'Harga: Menengah (Rp 45rb)', 'Sub-kategori: Populer'] },
  { id: 2, vote: 'laku', features: ['Rating rata-rata kompetitor: 4.7/5', 'Jumlah terjual: 1.2k/bln', 'Marketplace: Shopee'] },
  { id: 3, vote: 'tidak', features: ['Harga: +35% dari median pasar', 'Kompetitor aktif: 40+ produk', 'Kemiripan rendah: 45%'] },
  { id: 4, vote: 'laku', features: ['Kemiripan nama: 82%', 'Rating kompetitor: 4.8/5', 'Penjualan: Volume tinggi'] },
  { id: 5, vote: 'laku', features: ['Sub-kategori terpopuler', 'Harga menengah pasar', 'Produk serupa banyak laku'] },
]);
const selectedTree = ref<number | null>(null);
const rfVoteLaku = computed(() => rfTrees.value.filter(t => t.vote === 'laku').length);
const rfFeatures = [
  { name: 'avg_rating_kompetitor', type: 'float' },
  { name: 'avg_jumlah_terjual', type: 'int' },
  { name: 'avg_harga_kompetitor', type: 'float' },
  { name: 'harga_input', type: 'float' },
  { name: 'tfidf_similarity_score', type: 'float' },
  { name: 'kategori_encoded', type: 'int (label)' },
  { name: 'sub_kategori_encoded', type: 'int (label)' },
];
const toggleTreeVote = (id: number) => {
  const tree = rfTrees.value.find(t => t.id === id);
  if (tree) tree.vote = tree.vote === 'laku' ? 'tidak' : 'laku';
  selectedTree.value = selectedTree.value === id ? null : id;
};

// Price Analysis
const calcHargaUser = ref(50000);
const calcMedianPasar = ref(45000);
const priceDiffPercent = computed(() => ((calcHargaUser.value - calcMedianPasar.value) / calcMedianPasar.value) * 100);
const priceSegmen = computed(() => {
  if (priceDiffPercent.value < -20) return 'Ekonomis';
  if (priceDiffPercent.value > 20) return 'Mahal';
  return 'Menengah';
});

// Live Calculator
const calcSimilarity = ref(72);
const calcPopularity = ref(65);
const calcPriceDiff = ref(5);
const calcRfProb = computed(() => {
  const base = (calcSimilarity.value * 0.6 + calcPopularity.value * 0.4) / 100;
  return Math.min(0.98, Math.max(0.02, base));
});
const calcPriceAdjustment = computed(() => {
  const d = calcPriceDiff.value;
  if (d > 50) return 0.65;
  if (d > 30) return 0.78;
  if (d > 20) return 0.88;
  if (d < -20) return 0.97;
  return 1.0;
});
const calcFinalScore = computed(() => Math.min(100, Math.max(0, calcRfProb.value * 100 * calcPriceAdjustment.value)));

// Static display data
const scoreThresholds = [
  { range: 'Skor ≥ 70', label: 'Sangat Menarik', barColor: 'bg-emerald-500', textColor: 'text-emerald-400', icon: 'i-heroicons-star-solid' },
  { range: '40 ≤ Skor < 70', label: 'Cukup Menarik', barColor: 'bg-amber-500', textColor: 'text-amber-400', icon: 'i-heroicons-check-circle-solid' },
  { range: 'Skor < 40', label: 'Kurang Menarik', barColor: 'bg-red-500', textColor: 'text-red-400', icon: 'i-heroicons-exclamation-triangle-solid' },
];
const pipelineFormula = [
  { code: 'vec = TF_IDF.transform(nama_produk)', desc: 'Nama produk → vektor numerik', bg: 'bg-violet-500/15', textColor: 'text-violet-400' },
  { code: 'topK = cosine_similarity(vec, dataset)', desc: 'Temukan K produk paling mirip', bg: 'bg-blue-500/15', textColor: 'text-blue-400' },
  { code: 'features = aggregate(topK, H_input)', desc: 'Agregasi fitur dari produk serupa', bg: 'bg-amber-500/15', textColor: 'text-amber-400' },
  { code: 'P = RandomForest.predict_proba(features)', desc: 'N pohon voting → P(Laku|x)', bg: 'bg-emerald-500/15', textColor: 'text-emerald-400' },
  { code: 'Skor = P[1] × 100', desc: 'Konversi probabilitas ke skala 0–100', bg: 'bg-teal-500/15', textColor: 'text-teal-400' },
];
const pipelineSteps = [
  { icon: 'i-heroicons-document-text', title: 'Input Produk', desc: 'Nama, kategori, harga', bg: 'bg-gray-700' },
  { icon: 'i-heroicons-magnifying-glass', title: 'TF-IDF', desc: 'Vektorisasi nama', bg: 'bg-violet-900/60' },
  { icon: 'i-heroicons-link', title: 'Cosine Sim', desc: 'Cari produk mirip', bg: 'bg-blue-900/60' },
  { icon: 'i-heroicons-cpu-chip', title: 'Random Forest', desc: 'Voting N pohon', bg: 'bg-emerald-900/60' },
  { icon: 'i-heroicons-chart-bar', title: 'Skor Akhir', desc: 'Output prediksi', bg: 'bg-teal-900/60' },
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
.tab-fade-enter-active, .tab-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.tab-fade-enter-from { opacity: 0; transform: translateY(10px); }
.tab-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
