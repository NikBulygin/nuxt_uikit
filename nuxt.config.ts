// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/storybook',
  ],
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
})