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
    colors: {
      primary: 'emerald',
      neutral: 'slate',
    },
  },

  app: {
    head: {
      title: 'RadarUMKMBogor',
      meta: [{ name: 'description', content: 'Sistem Prediksi Daya Tarik Produk UMKM Bogor' }],
    },
  },

  runtimeConfig: {
    flaskApiUrl: process.env.FLASK_API_URL || 'http://127.0.0.1:5001',
    public: {
      appName: 'RadarUMKMBogor',
    },
  },

});
