<template>
  <input-date v-model="date" id="page-date-picker" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputDate from '@/components/primitive/input/date.vue'

const date = ref<Date | null>(null)
</script>
