import { defineNuxtPlugin } from '#app'
import { fetchTranslations } from '~/server/utils/i18n'

export default defineNuxtPlugin(async ({ $i18n }) => {
  const loadTranslations = async (locale: string) => {
    try {
      const translations = await fetchTranslations(locale)
      $i18n.mergeLocaleMessage(locale, translations)
    } catch (error) {
      console.error('Failed to load translations:', error)
    }
  }

  // Load initial translations
  await loadTranslations($i18n.locale.value)

  // Subscribe to language changes
  $i18n.onBeforeLanguageSwitch = async (oldLocale: string, newLocale: string) => {
    await loadTranslations(newLocale)
    return newLocale
  }
})