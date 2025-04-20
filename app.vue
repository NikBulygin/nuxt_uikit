<template>
  <div :class="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NotificationContainer from '~/components/notifications/NotificationContainer.vue'

// Для демонстрации темы (опционально)
const theme = ref('light')
</script>
