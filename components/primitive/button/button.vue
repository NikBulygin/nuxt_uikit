<template>
  <button
    @click="handleClick"
    class="bg-primary text-text-primary dark:bg-dark-primary-500 dark:text-dark-text-primary hover:bg-primary/80 dark:hover:bg-dark-primary-500/80 transition-all scalable round"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  emit('click')
}
</script>
