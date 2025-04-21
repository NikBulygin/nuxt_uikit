import ru from './locales/ru.json'
import en from './locales/en.json'
import kz from './locales/kz.json'

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    messages: {
      ru,
      kz,
      en
    }
  }))