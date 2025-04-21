<template>
  <div class="p-4">
    <div class="mb-6 space-y-4">
      <!-- Фильтры -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Выбор периода -->
        <div>
          <label class="block text-sm font-medium mb-2">Период</label>
          <div class="flex gap-2">
            <input-date
              v-model="dateRange.start"
              placeholder="От"
              month-year-only
              class="flex-1"
              @update:model-value="updateFilters"
            />
            <input-date
              v-model="dateRange.end"
              placeholder="До"
              month-year-only
              class="flex-1"
              @update:model-value="updateFilters"
            />
          </div>
        </div>

        <!-- Поиск по инвойсу -->
        <div>
          <label class="block text-sm font-medium mb-2">Номер инвойса</label>
          <input-text
            v-model="filters.invoiceNumber"
            placeholder="Введите номер инвойса"
          />
        </div>

        <!-- Поиск по ГТД -->
        <div>
          <label class="block text-sm font-medium mb-2">Номер ГТД</label>
          <input-text
            v-model="filters.gtdNumber"
            placeholder="Введите номер ГТД"
          />
        </div>
      </div>

      <!-- Количество элементов на странице -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm">Показывать по:</span>
          <select
            v-model="pagination.perPage"
            class="rounded-md border border-border dark:border-dark-border px-2 py-1"
          >
            <option v-for="n in [10, 20, 50, 100]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>

        <!-- Кнопка сохранения -->
        <button
          @click="saveChanges"
          :disabled="!hasChanges"
          class="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          Сохранить изменения
        </button>
      </div>
    </div>

    <!-- Таблица -->
    <container-table
      v-model="tableData"
      :columns="columns"
      @changed="handleTableChange"
    />

    <!-- Пагинация -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-text-secondary">
        Показано {{ paginationInfo.from }}-{{ paginationInfo.to }} из {{ total }}
      </div>
      <div class="flex gap-2">
        <button
          v-for="page in pages"
          :key="page"
          @click="pagination.current = page"
          :class="[
            'px-3 py-1 rounded',
            page === pagination.current
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 dark:hover:bg-dark-hover'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Уведомления о статусе -->
    <notification-example ref="notifications" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { WagonData } from '@prisma/client'
import type { WagonDataResponse, WagonDataFilters } from '~/types/api'
import ContainerTable from '@/components/container/table/index.vue'
import InputDate from '@/components/primitive/input/date.vue'
import InputText from '@/components/primitive/input/text.vue'
import NotificationExample from '@/components/examples/NotificationExample.vue'
import { useNotification } from '~/composables/useNotification'

// Состояние дат
const dateRange = ref({
  start: null as Date | null,
  end: null as Date | null
})

// Состояние фильтров
const filters = ref<WagonDataFilters>({
  invoiceNumber: '',
  gtdNumber: ''
})

// Состояние пагинации
const pagination = ref({
  current: 1,
  perPage: 20
})

// Данные таблицы
const tableData = ref<WagonData[]>([])
const total = ref(0)
const columns = ref([]) // Импортируем из index.vue

// Отслеживание изменений
const hasChanges = ref(false)
const notifications = ref()

// Обновление фильтров при изменении дат
const updateFilters = () => {
  if (dateRange.value.start) {
    filters.value.startDate = dateRange.value.start.toISOString()
  }
  if (dateRange.value.end) {
    filters.value.endDate = dateRange.value.end.toISOString()
  }
}

// Вычисляемые значения для пагинации
const pages = computed(() => {
  const totalPages = Math.ceil(total.value / pagination.value.perPage)
  return Array.from({ length: totalPages }, (_, i) => i + 1)
})

const paginationInfo = computed(() => {
  const from = (pagination.value.current - 1) * pagination.value.perPage + 1
  const to = Math.min(from + pagination.value.perPage - 1, total.value)
  return { from, to }
})

// Загрузка данных
const loadData = async () => {
  try {
    const response = await $fetch<WagonDataResponse>('/api/tables', {
      query: {
        page: pagination.value.current,
        perPage: pagination.value.perPage,
        ...filters.value
      }
    })
    tableData.value = response.data
    total.value = response.total
  } catch (error) {
    notifications.value.showError('Ошибка при загрузке данных')
  }
}

// Обработчики
const handleTableChange = ({ rowIndex, key, value }: { rowIndex: number, key: string, value: any }) => {
  hasChanges.value = true
  const newData = [...tableData.value]
  newData[rowIndex] = { ...newData[rowIndex], [key]: value }
  tableData.value = newData
}

const saveChanges = async () => {
  try {
    await $fetch('/api/tables', {
      method: 'PUT',
      body: tableData.value
    })
    notifications.value.showSuccess('Изменения успешно сохранены')
    hasChanges.value = false
    await loadData()
  } catch (error) {
    notifications.value.showError('Ошибка при сохранении изменений')
  }
}

// Следим за изменениями фильтров и пагинации
watch([filters, () => pagination.value.current, () => pagination.value.perPage], loadData, { deep: true })

// Инициализация
onMounted(async () => {
  // Загружаем колонки из index.vue
  const { columns: indexColumns } = await import('~/pages/index.vue')
  columns.value = indexColumns
  await loadData()
})
</script> 