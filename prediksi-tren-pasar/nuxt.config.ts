// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-auth-utils'],

  runtimeConfig: {
    flaskApiUrl: process.env.FLASK_API_URL || 'http://localhost:5000',
    public: {
      appName: 'Prediksi Tren Pasar',
    },
  },
});
