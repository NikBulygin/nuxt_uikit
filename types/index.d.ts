import type ru from '@/i18n/locales/ru'
export {}

declare global {
  type AnyObject = { [key: string]: any }
  type ULocaleKey = NestedKeyOf<typeof ru>
}
