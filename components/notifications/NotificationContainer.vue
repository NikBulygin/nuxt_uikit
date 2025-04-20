<template>
  <div
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-h-[80vh] overflow-y-auto"
  >
    <Message
      v-for="(notification, index) in notificationStore.notifications"
      :key="notification.id"
      :id="notification.id"
      :type="notification.type"
      :message="notification.message"
      :title="notification.title"
      :timer="notification.timer"
      @close="notificationStore.remove"
      :style="
        getOpacityStyle(index, notificationStore.notifications.length)
      "
      class="notification-item"
    />
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
import Message from '~/components/primitive/message/index.vue'

const notificationStore = useNotification()

/**
 * Вычисляет стиль прозрачности для уведомления в зависимости от его позиции в стеке
 * Самое верхнее уведомление (новое) имеет прозрачность 95% (opacity: 0.05),
 * а самое нижнее (старое) - без прозрачности (opacity: 1)
 */
const getOpacityStyle = (index: number, total: number) => {
  if (total <= 1) return {}

  // Вычисляем прозрачность от 5% (вверху, новые) до 100% (внизу, старые)
  const opacity = Math.min(1, 0.05 + (index / (total - 1)) * 0.95)

  return {
    opacity: opacity,
    transform: `scale(${0.95 + opacity * 0.05})`,
    zIndex: total - index
  }
}
</script>

<style scoped>
.notification-item {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>
