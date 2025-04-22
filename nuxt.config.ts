// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss'
  ],
  css: ['@/assets/css/main.css'],
  i18n: {
    bundle: {
      optimizeTranslationDirective: false
    },
    strategy: 'no_prefix',
    defaultLocale: 'ru',
    baseUrl: import.meta.env.DEV
      ? 'http://localhost:3300/'
      : 'https://core.mfgm.kz/',
    lazy: true,
    locales: [
      { code: 'en', name: 'English', language: 'en', file: 'en.ts' },
      { code: 'kz', name: 'Қазақ', language: 'kk', file: 'kz.ts' },
      { code: 'ru', name: 'Русский', language: 'ru', file: 'ru.ts' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18nRed',
      redirectOn: 'root'
    }
  }
})
