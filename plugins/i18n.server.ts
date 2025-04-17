import { defineNuxtPlugin } from '#app'
import { fetchTranslations } from '~/server/utils/i18n'

export default defineNuxtPlugin(async ({ $i18n }) => {
  // Получаем текущую локаль
  const locale = $i18n.locale.value

  // Загружаем серверные переводы
  const translations = await fetchTranslations(locale)

  // Добавляем серверные переводы в i18n
  $i18n.mergeLocaleMessage(locale, translations)
})