<template>
  <button
    class="p-2 rounded-md bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary"
    @click="toggleTheme"
  >
    <span class="dark:hidden">🌙</span>
    <span class="hidden dark:inline">☀️</span>
  </button>
</template>

<script setup lang="ts">
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark')
}
</script>
