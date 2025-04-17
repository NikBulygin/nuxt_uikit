// Серверные переводы (будут иметь приоритет над JSON)
const translations = {
  en: {
    serverKey: 'Server-only message' // Этот ключ есть только на сервере
  },
  ru: {
    serverKey: 'Серверное сообщение'
  },
  kz: {
    serverKey: 'Сервер хабарламасы'
  }
}

// Функция для загрузки JSON переводов
const loadJsonTranslations = async (locale: string) => {
  try {
    // Используем динамический импорт для загрузки JSON
    const module = await import(`../../i18n/locales/${locale}.json`)
    return module.default || {}
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error)
    return {}
  }
}

// Priority order: .env -> runtime -> json -> server
export async function fetchTranslations(locale: string): Promise<Record<string, string>> {
  try {
    // Загружаем переводы из JSON
    const jsonTranslations = await loadJsonTranslations(locale)

    // Получаем серверные переводы
    const serverTranslations = translations[locale as keyof typeof translations] || {}

    // Объединяем переводы с приоритетом серверных
    return {
      ...jsonTranslations,
      ...serverTranslations
    }
  } catch (error) {
    console.error('Error in fetchTranslations:', error)
    // Возвращаем русский перевод как fallback
    return translations.ru
  }
}
