<template>
  <button
    @click="toggleTheme"
    class="rounded-lg p-2.5 text-sm hover:bg-accent hover:text-accent-foreground"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
  >
    <span class="sr-only">{{ isDark ? 'Switch to light theme' : 'Switch to dark theme' }}</span>
    <IconSun v-if="!isDark" class="h-5 w-5" />
    <IconMoon v-else class="h-5 w-5" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script> 