// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-auth-utils'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  ui: {
    theme: {
      colors: ['emerald', 'slate'],
    },
  },

  app: {
    head: {
      title: 'RadarUMKMBogor',
      meta: [{ name: 'description', content: 'Sistem Prediksi Daya Tarik Produk UMKM Bogor' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon.png' },
      ],
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    flaskApiUrl: process.env.FLASK_API_URL || 'https://radarumkmbogor-api.onrender.com',
    public: {
      appName: 'RadarUMKMBogor',
    },
  },

  icon: {
    serverBundle: {
      collections: ['heroicons'],
    },
  },

  nitro: {
    externals: {
      external: ['pg', 'csv-parse'],
    },
  },
});
