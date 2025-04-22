<template>
  {{ t('language.select') }}
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NotificationContainer from '~/components/notifications/NotificationContainer.vue'
</script>
