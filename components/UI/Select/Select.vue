<template>
  <div class="relative w-full" ref="selectRef">
    <!-- Select trigger -->
    <div
      @click="isOpen = !isOpen"
      class="flex items-center justify-between w-full px-4 py-2 border rounded-lg cursor-pointer hover:bg-light-surface dark:hover:bg-dark-surface dark:bg-dark-background dark:border-dark-border"
    >
      <div class="flex items-center gap-2">
        <span v-if="!multiple && selectedItems.length" class="flex items-center gap-2">
          <img
            v-if="selectedItems[0].prefix_image"
            :src="selectedItems[0].prefix_image"
            class="w-5 h-5"
          />
          {{ selectedItems[0].text }}
          <img
            v-if="selectedItems[0].post_image"
            :src="selectedItems[0].post_image"
            class="w-5 h-5"
          />
        </span>
        <div v-else-if="multiple && selectedItems.length" class="flex flex-wrap gap-1">
          <span
            v-for="item in selectedItems"
            :key="item.text"
            class="flex items-center gap-1 px-2 py-1 text-sm bg-light-primary-100 dark:bg-dark-primary-100 rounded"
          >
            <img v-if="item.prefix_image" :src="item.prefix_image" class="w-4 h-4" />
            {{ item.text }}
            <img v-if="item.post_image" :src="item.post_image" class="w-4 h-4" />
          </span>
        </div>
        <span v-else class="text-light-text-tertiary dark:text-dark-text-tertiary"
          >Select option</span
        >
      </div>
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg dark:bg-dark-background dark:border-dark-border"
    >
      <!-- Search input внутри выпадающего списка -->
      <div v-if="withSearch" class="p-2 border-b dark:border-dark-border">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-primary-500 dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary"
          placeholder="Search..."
          @click.stop
        />
      </div>

      <div class="py-1 max-h-60 overflow-y-auto">
        <div
          v-for="item in filteredItems"
          :key="item.text"
          @click="selectItem(item)"
          class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-light-primary-50 dark:hover:bg-dark-primary-50"
        >
          <div class="flex items-center gap-2">
            <img v-if="item.prefix_image" :src="item.prefix_image" class="w-5 h-5" />
            {{ item.text }}
            <img v-if="item.post_image" :src="item.post_image" class="w-5 h-5" />
          </div>
          <svg
            v-if="isSelected(item)"
            class="w-5 h-5 text-light-primary-500 dark:text-dark-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <!-- Сообщение, если ничего не найдено -->
        <div
          v-if="filteredItems.length === 0"
          class="px-4 py-2 text-light-text-tertiary dark:text-dark-text-tertiary"
        >
          No results found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import type { SelectItem } from '~/types/general/select'

interface Props {
  modelValue: SelectItem | SelectItem[]
  items: SelectItem[]
  multiple?: boolean
  withSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  withSearch: false
})

const emit = defineEmits(['update:modelValue'])

const selectRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const selectedItems = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue].filter(Boolean)
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  return props.items.filter(item =>
    item.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const isSelected = (item: SelectItem) => {
  return selectedItems.value.some(selected => selected.text === item.text)
}

const selectItem = (item: SelectItem) => {
  if (props.multiple) {
    const newValue = isSelected(item)
      ? selectedItems.value.filter(i => i.text !== item.text)
      : [...selectedItems.value, item]
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', item)
    isOpen.value = false
  }
}

// Сбрасываем поиск при закрытии выпадающего списка
watch(isOpen, newValue => {
  if (!newValue) {
    searchQuery.value = ''
  }
})

// Close dropdown when clicking outside
onClickOutside(selectRef, () => {
  isOpen.value = false
})
</script>
