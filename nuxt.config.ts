// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  typescript: {
    strict: true,
    typeCheck: true
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['@/assets/css/main.css'],
  i18n: {
    langDir: 'locales',
    defaultLocale: 'ru',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      cookieSecure: process.env.NODE_ENV === 'production'
    },
    locales: [
      {
        code: 'ru',
        iso: 'ru-RU',
        name: 'Русский',
        file: 'ru.json'
      },
      {
        code: 'kz',
        iso: 'kk-KZ',
        name: 'Қазақша',
        file: 'kz.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      }
    ],
    strategy: 'prefix_and_default',
    vueI18n: './i18n.config.ts',
    lazy: true,
    skipSettingLocaleOnNavigate: false
  },
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    minify: true,
    timing: false,
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Resource-Policy': 'same-origin',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests",
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  }
})