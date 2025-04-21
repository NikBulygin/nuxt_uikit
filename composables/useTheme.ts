import { ref, onMounted, watch } from 'vue'

export const useTheme = () => {
  const isDark = ref(false)

  const initTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // If no saved theme, check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const applyTheme = () => {
    // Apply theme to document
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save theme preference
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Watch for system theme changes
  onMounted(() => {
    initTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  })

  return {
    isDark,
    toggleTheme
  }
} 