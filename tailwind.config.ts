/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  darkMode: 'class', // Включаем поддержку темной темы через класс
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif']
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        h2: ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        h3: ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        h4: ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }],
        h5: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        h6: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }]
      },
      colors: {
        // Стандартные цвета для доступа через короткие имена
        primary: {
          DEFAULT: '#8b5cf6', // Основной цвет (соответствует light-primary-500)
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065'
        },
        background: '#ffffff',
        surface: '#f8fafc',
        text: {
          primary: '#171717',
          secondary: '#404040',
          tertiary: '#737373'
        },
        border: '#e5e5e5',

        // Светлая тема
        light: {
          primary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6', // Основной фиолетовый акцент
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065'
          },
          background: '#ffffff',
          surface: '#f8fafc',
          text: {
            primary: '#171717',
            secondary: '#404040',
            tertiary: '#737373'
          },
          border: '#e5e5e5'
        },
        // Темная тема (инверсия)
        dark: {
          primary: {
            50: '#2e1065',
            100: '#4c1d95',
            200: '#5b21b6',
            300: '#6d28d9',
            400: '#7c3aed',
            500: '#8b5cf6', // Основной фиолетовый акцент остается тем же
            600: '#a78bfa',
            700: '#c4b5fd',
            800: '#ddd6fe',
            900: '#ede9fe',
            950: '#f5f3ff'
          },
          background: '#0a0a0a',
          surface: '#171717',
          text: {
            primary: '#f8fafc',
            secondary: '#e5e5e5',
            tertiary: '#a3a3a3'
          },
          border: '#404040'
        },
        // Цвета для уведомлений (одинаковые для обеих тем)
        success: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#065f46'
        },
        info: {
          light: '#eff6ff',
          DEFAULT: '#3b82f6',
          dark: '#1e40af'
        },
        warning: {
          light: '#fffbeb',
          DEFAULT: '#f59e0b',
          dark: '#92400e'
        },
        danger: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#991b1b'
        }
      }
    }
  },
  plugins: []
}
