module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['nuxt', '@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
