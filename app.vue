<template>
  <div class="min-h-screen bg-background text-foreground">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'
import NotificationContainer from '~/components/notifications/NotificationContainer.vue'

// Initialize theme
useTheme()
</script>

<style>
body {
  @apply transition-colors duration-200;
}
</style>
