<template>
  <div class="relative">
    <!-- Панель действий -->
    <div 
      v-if="selectedRows.length > 0"
      class="absolute top-0 left-0 right-0 -mt-12 flex justify-between items-center p-2 bg-light-surface dark:bg-dark-surface rounded-t-lg border border-light-border dark:border-dark-border border-b-0 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <span class="text-light-text-secondary dark:text-dark-text-secondary text-sm">
          Выбрано: {{ selectedRows.length }}
        </span>
        <button 
          @click="duplicateSelected"
          class="p-2 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-light-primary-50 dark:hover:bg-dark-primary-950/50 transition-all"
          title="Копировать выбранные строки"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button 
          @click="deleteSelected"
          class="p-2 rounded-lg text-danger-DEFAULT hover:text-white hover:bg-danger-DEFAULT transition-all group"
          title="Удалить выбранные строки"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Таблица -->
    <div 
      ref="tableContainer" 
      class="relative max-h-[80vh] border border-light-border dark:border-dark-border rounded-lg select-none bg-white dark:bg-dark-background"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      :class="{'cursor-grab': !isDragging, 'cursor-grabbing': isDragging}"
    >
      <div class="overflow-auto">
        <table class="w-full border-collapse min-w-[768px] absolute z-0">
          <thead class="bg-light-surface dark:bg-dark-surface sticky top-0 z-[1]">
            <tr>
              <th class="w-10 p-3 border-b border-light-border dark:border-dark-border">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleAllRows"
                  class="rounded border-light-border dark:border-dark-border text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
              </th>
              <th 
                v-for="column in columns" 
                :key="column.key"
                class="p-3 text-left border-b border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary font-medium cursor-pointer hover:bg-light-primary-50 dark:hover:bg-dark-primary-950/50"
                @click="sortByColumn(column.key)"
              >
                <div class="flex items-center gap-1">
                  {{ column.label }}
                  <span v-if="sortConfig.key === column.key" class="text-primary-500">
                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, rowIndex) in sortedData" 
              :key="rowIndex"
              :class="{
                'bg-light-primary-50 dark:bg-dark-primary-950/50': selectedRows.includes(rowIndex),
                'hover:bg-light-primary-50/50 dark:hover:bg-dark-primary-950/30': !selectedRows.includes(rowIndex),
                'dark:bg-dark-background': !selectedRows.includes(rowIndex)
              }"
              class="transition-colors"
            >
              <td class="w-10 p-3 border-b border-light-border dark:border-dark-border">
                <input
                  type="checkbox"
                  v-model="selectedRows"
                  :value="rowIndex"
                  class="rounded border-light-border dark:border-dark-border text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
              </td>
              <td 
                v-for="column in columns" 
                :key="column.key"
                class="p-3 border-b border-light-border dark:border-dark-border"
              >
                <component
                  v-if="column.editable"
                  :is="getInputComponent(column.type)"
                  v-model="row[column.key]"
                  :disabled="column.computed"
                  :id="`table-input-${rowIndex}-${column.key}`"
                  class="w-full"
                  @update:modelValue="handleCellChange(rowIndex, column.key, $event)"
                />
                <span v-else class="text-light-text-primary dark:text-dark-text-primary">
                  {{ formatValue(row[column.key], column.type) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Кнопка добавления -->
      <div class="sticky bottom-0 bg-light-surface dark:bg-dark-surface p-3 border-t border-light-border dark:border-dark-border">
        <button 
          @click="addRow"
          class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-background"
        >
          Добавить строку
        </button>
      </div>

      <!-- Индикатор прокрутки для мобильных устройств -->
      <div 
        class="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-light-surface dark:bg-dark-surface px-3 py-1 rounded-full shadow-md text-sm text-light-text-secondary dark:text-dark-text-secondary md:hidden"
      >
        Прокрутите для просмотра →
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InputFloat from '@/components/primitive/input/float.vue'
import InputText from '@/components/primitive/input/text.vue'
import InputNumber from '@/components/primitive/input/number.vue'
import InputDate from '@/components/primitive/input/date.vue'
import InputFile from '@/components/primitive/input/file.vue'

interface Column {
  key: string
  label: string
  type: 'float' | 'text' | 'number' | 'date' | 'file'
  editable?: boolean
  computed?: boolean
}

interface Props {
  modelValue: Record<string, any>[]
  columns: Column[]
}

interface Emits {
  (e: 'update:modelValue', value: Record<string, any>[]): void
  (e: 'changed', value: { rowIndex: number, key: string, value: any }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Sorting
const sortConfig = ref({
  key: '',
  direction: 'asc' as 'asc' | 'desc'
})

const sortByColumn = (key: string) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
}

const sortedData = computed(() => {
  if (!sortConfig.value.key) return props.modelValue

  return [...props.modelValue].sort((a, b) => {
    const aValue = a[sortConfig.value.key]
    const bValue = b[sortConfig.value.key]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    const modifier = sortConfig.value.direction === 'asc' ? 1 : -1

    if (aValue instanceof Date && bValue instanceof Date) {
      return (aValue.getTime() - bValue.getTime()) * modifier
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier
    }

    return aValue.toString().localeCompare(bValue.toString()) * modifier
  })
})

// Выбранные строки
const selectedRows = ref<number[]>([])
const isAllSelected = computed(() => {
  return selectedRows.value.length === props.modelValue.length
})

const toggleAllRows = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    selectedRows.value = props.modelValue.map((_, index) => index)
  } else {
    selectedRows.value = []
  }
}

const deleteSelected = () => {
  const newValue = props.modelValue.filter((_, index) => !selectedRows.value.includes(index))
  emit('update:modelValue', newValue)
  selectedRows.value = []
}

const duplicateSelected = () => {
  if (selectedRows.value.length === 0) return
  
  // Сортируем индексы в обратном порядке, чтобы вставка не влияла на последующие индексы
  const sortedIndexes = [...selectedRows.value].sort((a, b) => b - a)
  let newValue = [...props.modelValue]
  
  // Копируем каждую выбранную строку
  sortedIndexes.forEach(index => {
    const newRow = { ...props.modelValue[index] }
    newValue.splice(index + 1, 0, newRow)
  })

  emit('update:modelValue', newValue)
  
  // Обновляем выбранные строки на новые скопированные
  selectedRows.value = sortedIndexes.map(index => index + 1)
}

// Drag and Drop functionality
const tableContainer = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const scrollLeft = ref(0)
const scrollTop = ref(0)

const startDrag = (e: MouseEvent) => {
  if (!tableContainer.value) return
  isDragging.value = true
  startX.value = e.pageX - tableContainer.value.offsetLeft
  startY.value = e.pageY - tableContainer.value.offsetTop
  scrollLeft.value = tableContainer.value.scrollLeft
  scrollTop.value = tableContainer.value.scrollTop
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !tableContainer.value) return
  e.preventDefault()
  const x = e.pageX - tableContainer.value.offsetLeft
  const y = e.pageY - tableContainer.value.offsetTop
  const walkX = (x - startX.value)
  const walkY = (y - startY.value)
  tableContainer.value.scrollLeft = scrollLeft.value - walkX
  tableContainer.value.scrollTop = scrollTop.value - walkY
}

const stopDrag = () => {
  isDragging.value = false
}

// Table functionality
const getInputComponent = (type: string) => {
  switch (type) {
    case 'float':
      return InputFloat
    case 'text':
      return InputText
    case 'number':
      return InputNumber
    case 'date':
      return InputDate
    case 'file':
      return InputFile
    default:
      return InputText
  }
}

const formatValue = (value: any, type: string) => {
  if (value === null || value === undefined) return ''
  switch (type) {
    case 'float':
      return Number(value).toFixed(2)
    case 'date':
      return value instanceof Date ? value.toLocaleDateString() : value
    case 'file':
      return value.name || value
    default:
      return value.toString()
  }
}

const addRow = () => {
  const newRow = props.columns.reduce((acc, column) => {
    switch (column.type) {
      case 'float':
      case 'number':
        acc[column.key] = 0
        break
      case 'date':
        acc[column.key] = null
        break
      default:
        acc[column.key] = ''
    }
    return acc
  }, {} as Record<string, any>)
  
  emit('update:modelValue', [...props.modelValue, newRow])
}

const handleCellChange = (rowIndex: number, key: string, value: any) => {
  const newValue = [...props.modelValue]
  newValue[rowIndex] = { ...newValue[rowIndex], [key]: value }
  emit('update:modelValue', newValue)
  emit('changed', { rowIndex, key, value })
}
</script>

<style scoped>
.table-container {
  cursor: grab;
}
.table-container:active {
  cursor: grabbing;
}
</style>
