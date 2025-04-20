<template>
  <div>
    <component :is="iconComponent" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconInfo from './IconInfo.vue'
import IconSuccess from './IconSuccess.vue'
import IconWarning from './IconWarning.vue'
import IconDanger from './IconDanger.vue'

const props = defineProps<{
  name: string
}>()

const iconComponent = computed(() => {
  switch (props.name) {
    case 'info':
      return IconInfo
    case 'success':
      return IconSuccess
    case 'warning':
      return IconWarning
    case 'danger':
      return IconDanger
    default:
      return null
  }
})
</script>
