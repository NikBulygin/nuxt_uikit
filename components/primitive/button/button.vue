<template>
  <button
    @click="handleClick"
    class="bg-light-primary text-light-text-primary dark:bg-dark-primary dark:text-dark-text-primary hover:bg-light-primary/80 dark:hover:bg-dark-primary/80 transition-colors duration-200"
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
