export const t = (key: ULocaleKey, extra?: AnyObject) => {
  useNuxtApp()?.$i18n.t(key, { ...extra })
}
