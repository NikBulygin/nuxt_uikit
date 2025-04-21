<template>
  <div>
    <!-- Regular date picker -->
    <input-date 
      v-model="date" 
      id="page-date-picker" 
      label="Regular Date Picker"
      class="mb-4"
    />
    
    <!-- Month-Year picker -->
    <input-date 
      v-model="monthYear" 
      id="month-year-picker"
      label="Month-Year Picker"
      month-year-mode
      date-format="MM/YYYY"
      placeholder="MM/YYYY"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputDate from '@/components/primitive/input/date.vue'

const date = ref<Date | null>(null)
const monthYear = ref<Date | null>(null)
</script>
