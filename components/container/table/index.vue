<template>
  <div class="table-wrapper">
    <!-- Toolbar -->
    <div
      class="toolbar mb-2 h-[44px] flex items-center justify-between gap-2"
    >
      <!-- Left side -->
      <div class="flex items-center gap-4">
        <!-- Items per page selector -->
        <div
          class="flex items-center gap-2"
          :class="{ 'opacity-50 pointer-events-none': isEditMode }"
        >
          <span class="text-sm text-gray-600 dark:text-gray-300"
            >{{ toolbarTexts.rowsPerPage }}:</span
          >
          <select
            v-model="itemsPerPage"
            class="p-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
            @change="onItemsPerPageChange"
            :disabled="isEditMode"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <!-- Action buttons in edit mode -->
        <template v-if="isEditMode">
          <button
            v-if="hasSelected"
            @click="deleteSelected"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {{ toolbarTexts.actions.delete }}
          </button>
          <button
            v-if="hasSelected"
            @click="copySelected"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {{ toolbarTexts.actions.copy }}
          </button>
          <button
            @click="cancelEdit"
            class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {{ toolbarTexts.actions.cancel }}
          </button>
          <button
            @click="saveChanges"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {{ toolbarTexts.actions.save }}
          </button>
        </template>
      </div>

      <!-- Right side -->
      <div>
        <button
          v-if="!isEditMode"
          @click="startEdit"
          class="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          {{ toolbarTexts.editMode }}
        </button>
      </div>
    </div>

    <div class="table-container w-full">
      <div class="table-grid" :style="gridTemplateColumns">
        <!-- Checkbox header -->
        <div
          v-if="isEditMode"
          class="table-header-cell p-2 bg-primary-500 text-text-primary dark:bg-primary-500 dark:text-text-primary flex items-center"
        >
          <input
            type="checkbox"
            v-model="selectAll"
            @change="toggleSelectAll"
            class="w-4 h-4 rounded border-gray-300 cursor-pointer"
          />
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="w-full text-center py-4 text-gray-500">
          {{ t('table.loading') }}
        </div>

        <!-- Error state -->
        <div
          v-else-if="error"
          class="w-full text-center py-4 text-red-500"
        >
          {{ t('table.error') }}
        </div>

        <!-- No data state -->
        <div
          v-else-if="!displayData.length"
          class="w-full text-center py-4 text-gray-500"
        >
          {{ t('table.noData') }}
        </div>

        <!-- Column headers -->
        <template v-for="column in props.meta.columns" :key="column.key">
          <div
            class="table-header-cell p-2 bg-primary-500 text-text-primary dark:bg-primary-500 dark:text-text-primary flex items-center gap-1 cursor-pointer select-none"
            @click="
              column.type !== 'formula' &&
                !isEditMode &&
                handleSort(column.key)
            "
            :class="{
              'cursor-not-allowed': column.type === 'formula' || isEditMode
            }"
            :title="
              column.type !== 'formula' && !isEditMode
                ? getSortTitle(column.key)
                : ''
            "
          >
            <span class="flex-1">{{ column.title }}</span>
            <div
              v-if="column.type !== 'formula' && !isEditMode"
              class="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 transition-transform"
                :class="{
                  'opacity-30': props.sorted?.key !== column.key,
                  'rotate-180':
                    props.sorted?.key === column.key &&
                    props.sorted.direction === 'desc'
                }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 20V4M5 11l7-7 7 7" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Table rows -->
        <template v-for="(row, rowIndex) in displayData" :key="rowIndex">
          <!-- Checkbox cell -->
          <div
            v-if="isEditMode"
            class="table-cell p-2 flex items-center"
            :class="[
              isNewRow(rowIndex)
                ? 'bg-gray-700 text-white'
                : rowIndex % 2 === 0
                ? 'bg-primary-50 dark:bg-primary-400'
                : 'bg-primary-100 dark:bg-primary-500'
            ]"
          >
            <input
              type="checkbox"
              v-model="selectedRows[rowIndex]"
              class="w-4 h-4 rounded border-gray-300 cursor-pointer"
              :class="{
                'bg-gray-600 border-gray-500': isNewRow(rowIndex)
              }"
            />
          </div>

          <!-- Data cells -->
          <template
            v-for="column in props.meta.columns"
            :key="`${rowIndex}-${column.key}`"
          >
            <div
              class="table-cell p-2"
              :class="[
                isNewRow(rowIndex)
                  ? rowIndex % 2 === 0
                    ? 'bg-gray-50 dark:bg-gray-700'
                    : 'bg-gray-100 dark:bg-gray-600'
                  : rowIndex % 2 === 0
                  ? 'bg-primary-50 dark:bg-primary-400'
                  : 'bg-primary-100 dark:bg-primary-500',
                editedDataErrors[rowIndex]?.[column.key] &&
                  'border-red-500 border'
              ]"
            >
              <template v-if="isEditMode && column.type !== 'formula'">
                <InputText
                  v-if="column.type === 'text'"
                  v-model="editedData[rowIndex][column.key]"
                  :validation-type="column.validation?.type || 'custom'"
                  :regex="getValidationPattern(column.validation)"
                  :required="column.validation?.required"
                  :min-length="column.validation?.minLength"
                  :max-length="column.validation?.maxLength"
                  :error="editedDataErrors[rowIndex]?.[column.key]"
                  @error="
                    msg => handleValidationError(rowIndex, column.key, msg)
                  "
                  @valid="() => clearValidationError(rowIndex, column.key)"
                />
                <InputNumber
                  v-else-if="column.type === 'number'"
                  v-model="editedData[rowIndex][column.key]"
                  :min="column.validation?.min"
                  :max="column.validation?.max"
                  :required="column.validation?.required"
                  :error="editedDataErrors[rowIndex]?.[column.key]"
                  @error="
                    msg => handleValidationError(rowIndex, column.key, msg)
                  "
                  @valid="() => clearValidationError(rowIndex, column.key)"
                />
                <InputFloat
                  v-else-if="column.type === 'float'"
                  v-model="editedData[rowIndex][column.key]"
                  :min="column.validation?.min"
                  :max="column.validation?.max"
                  :precision="column.validation?.precision || 2"
                  :required="column.validation?.required"
                  :error="editedDataErrors[rowIndex]?.[column.key]"
                  @error="
                    msg => handleValidationError(rowIndex, column.key, msg)
                  "
                  @valid="() => clearValidationError(rowIndex, column.key)"
                />
                <InputDate
                  v-else-if="column.type === 'date'"
                  v-model="editedData[rowIndex][column.key]"
                  :required="column.validation?.required"
                  :date-format="column.validation?.format"
                  :error="editedDataErrors[rowIndex]?.[column.key]"
                  @error="
                    msg => handleValidationError(rowIndex, column.key, msg)
                  "
                  @valid="() => clearValidationError(rowIndex, column.key)"
                />
              </template>
              <template v-else>
                {{
                  column.type === 'formula'
                    ? column.formula(getRowData(rowIndex))
                    : getRowData(rowIndex)[column.key]
                }}
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Add new row button -->
    <div v-if="isEditMode" class="mt-4 flex justify-center">
      <button
        @click="addNewRow"
        class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600"
      >
        <span class="text-xl">+</span>
      </button>
    </div>

    <!-- Table footer with pagination -->
    <ContainerPagination
      v-if="props.pagination && !isEditMode"
      :current-page="currentPage"
      :total-pages="computedTotalPages"
      :total-items="props.pagination.totalItems"
      :items-per-page="props.pagination.itemsPerPage"
      @update:page="onPageChange"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ContainerPagination from '~/components/container/pagination/index.vue'
import InputText from '~/components/primitive/input/text.vue'
import InputNumber from '~/components/primitive/input/number.vue'
import InputFloat from '~/components/primitive/input/float.vue'
import InputDate from '~/components/primitive/input/date.vue'

const { t } = useI18n()

interface ValidationMeta {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string | RegExp
  type?:
    | 'email'
    | 'strongPassword'
    | 'basicPassword'
    | 'numbersOnly'
    | 'lettersOnly'
    | 'url'
    | 'phone'
    | 'custom'
  step?: number
  precision?: number
  format?: string
}

interface ColumnMeta {
  key: string
  title: string
  type: 'text' | 'date' | 'float' | 'formula' | 'number'
  width?: string
  formula?: (row: any) => any
  validation?: ValidationMeta
}

interface Props {
  meta: {
    columns: ColumnMeta[]
  }
  data: {
    [key: string]: any
  }[]
  pagination?: {
    currentPage: number
    totalItems: number
    itemsPerPage: number
  }
  sorted?: {
    key: string
    direction: 'asc' | 'desc'
  }
}

const props = defineProps<Props>()
const emit = defineEmits([
  'copy',
  'delete',
  'update:itemsPerPage',
  'update:page',
  'save',
  'sort',
  'add'
])

const selectedRows = ref<{ [key: number]: boolean }>({})
const selectAll = ref(false)
const itemsPerPage = ref(props.pagination?.itemsPerPage || 10)
const currentPage = ref(props.pagination?.currentPage || 1)
const isEditMode = ref(false)
const editedData = ref<{ [key: number]: { [key: string]: any } }>({})
const editedDataErrors = ref<{ [key: number]: { [key: string]: string } }>(
  {}
)
const newRows = ref<number[]>([])

// Проверка наличия выбранных строк
const hasSelected = computed(() =>
  Object.values(selectedRows.value).some(v => v)
)

// Получение данных строки (с учетом редактирования)
const getRowData = (index: number) => {
  const rowData = editedData.value[index] || props.data[index]
  if (!rowData) return {}

  const processedData = { ...rowData }
  props.meta.columns.forEach(column => {
    if (column.type === 'date') {
      processedData[column.key] = processedData[column.key]
        ? new Date(processedData[column.key])
        : null
    }
  })
  return processedData
}

// Вычисляемые данные для отображения
const displayData = computed(() => {
  const allData = [...props.data]

  // Добавляем новые строки
  newRows.value.forEach(newRowIndex => {
    if (editedData.value[newRowIndex]) {
      allData.push(editedData.value[newRowIndex])
    }
  })

  return allData.map(row => {
    const displayRow = { ...row }
    props.meta.columns.forEach(column => {
      if (column.type === 'date' && displayRow[column.key]) {
        displayRow[column.key] = new Date(displayRow[column.key])
      }
    })
    return displayRow
  })
})

// Функция для проверки, является ли строка новой
const isNewRow = (index: number) => {
  return newRows.value.includes(index)
}

// Получение индексов выбранных строк
const getSelectedIndices = () => {
  return Object.entries(selectedRows.value)
    .filter(([_, selected]) => selected)
    .map(([index]) => parseInt(index))
}

// Инициализация данных для редактирования
const initEditedData = () => {
  editedData.value = props.data.reduce((acc, row, index) => {
    acc[index] = { ...row }
    props.meta.columns.forEach(column => {
      if (column.type === 'date') {
        acc[index][column.key] = acc[index][column.key]
          ? new Date(acc[index][column.key])
          : null
      }
    })
    return acc
  }, {} as { [key: number]: { [key: string]: any } })
}

// Функция начала редактирования
const startEdit = () => {
  isEditMode.value = true
  initEditedData()
}

// Функция отмены редактирования
const cancelEdit = () => {
  isEditMode.value = false
  editedData.value = {}
  editedDataErrors.value = {}
  newRows.value = []
  selectedRows.value = {}
  selectAll.value = false
}

// Добавим новые методы для обработки валидации
const handleValidationError = (
  rowIndex: number,
  columnKey: string,
  errorType: string,
  params?: any
) => {
  if (!editedDataErrors.value[rowIndex]) {
    editedDataErrors.value[rowIndex] = {}
  }
  editedDataErrors.value[rowIndex][columnKey] = getValidationMessage(
    errorType,
    params
  )
}

const clearValidationError = (rowIndex: number, columnKey: string) => {
  if (editedDataErrors.value[rowIndex]) {
    delete editedDataErrors.value[rowIndex][columnKey]
    if (Object.keys(editedDataErrors.value[rowIndex]).length === 0) {
      delete editedDataErrors.value[rowIndex]
    }
  }
}

// Обновим метод saveChanges с проверкой валидации
const saveChanges = () => {
  // Проверяем наличие ошибок валидации
  if (Object.keys(editedDataErrors.value).length > 0) {
    // Если есть ошибки, не позволяем сохранить
    return
  }

  // Собираем все изменения
  const changes = {
    edited: {} as { [key: number]: any },
    new: [] as any[]
  }

  // Обрабатываем отредактированные строки
  Object.entries(editedData.value).forEach(([index, rowData]) => {
    const idx = parseInt(index)
    if (isNewRow(idx)) {
      changes.new.push(rowData)
    } else {
      changes.edited[idx] = rowData
    }
  })

  emit('save', changes)
  cancelEdit()
}

// Обновим метод addNewRow
const addNewRow = () => {
  const newIndex = props.data.length + newRows.value.length

  // Создаем новую строку с значениями по умолчанию
  const newRow = props.meta.columns.reduce((acc, column) => {
    if (column.type !== 'formula') {
      switch (column.type) {
        case 'date':
          acc[column.key] = null
          break
        case 'number':
        case 'float':
          acc[column.key] = null
          break
        case 'text':
          acc[column.key] = ''
          break
        default:
          acc[column.key] = null
      }
    }
    return acc
  }, {} as { [key: string]: any })

  // Добавляем новую строку в editedData
  editedData.value[newIndex] = newRow

  // Добавляем индекс в список новых строк
  newRows.value.push(newIndex)
}

// Копирование выбранных строк
const copySelected = () => {
  const selectedIndices = getSelectedIndices()

  // Получаем данные выбранных строк
  const selectedData = selectedIndices.map(index => {
    // Определяем, является ли строка новой или существующей
    const sourceData = isNewRow(index)
      ? editedData.value[index]
      : props.data[index]

    // Создаем глубокую копию данных
    const rowData = { ...sourceData }

    // Обрабатываем специальные типы данных
    props.meta.columns.forEach(column => {
      if (column.type === 'date' && rowData[column.key]) {
        // Если значение уже является объектом Date, создаем новый объект Date
        // Если значение - строка, парсим ее в Date
        rowData[column.key] =
          rowData[column.key] instanceof Date
            ? new Date(rowData[column.key].getTime())
            : new Date(rowData[column.key])
      }
      // Пропускаем формулы, так как они вычисляются
      if (column.type === 'formula') {
        delete rowData[column.key]
      }
    })

    return rowData
  })

  // Добавляем скопированные строки как новые
  selectedData.forEach(rowData => {
    const newIndex = props.data.length + newRows.value.length
    editedData.value[newIndex] = rowData
    newRows.value.push(newIndex)
  })

  // Снимаем выделение со всех строк
  Object.keys(selectedRows.value).forEach(key => {
    selectedRows.value[key] = false
  })
  selectAll.value = false
}

// Удаление выбранных строк
const deleteSelected = () => {
  const selectedIndices = getSelectedIndices()
  selectedIndices.sort((a, b) => b - a)

  // Разделяем индексы на новые и существующие строки
  const newRowIndices: number[] = []
  const existingRowIndices: number[] = []

  selectedIndices.forEach(index => {
    if (isNewRow(index)) {
      newRowIndices.push(index)
    } else {
      existingRowIndices.push(index)
    }
  })

  // Удаляем новые строки
  newRowIndices.forEach(index => {
    const newRowIndex = newRows.value.indexOf(index)
    if (newRowIndex > -1) {
      newRows.value.splice(newRowIndex, 1)
      delete editedData.value[index]
      delete selectedRows.value[index]
    }
  })

  // Отправляем на удаление только существующие строки
  if (existingRowIndices.length > 0) {
    emit('delete', existingRowIndices)
  }
  selectAll.value = false
}

// Переключение выделения всех строк
const toggleSelectAll = () => {
  const newValue = selectAll.value
  props.data.forEach((_, index) => {
    selectedRows.value[index] = newValue
  })
  newRows.value.forEach(index => {
    selectedRows.value[index] = newValue
  })
}

// Обработка изменения страницы
const onPageChange = (page: number) => {
  currentPage.value = page
  emit('update:page', page)
}

// Обработка изменения количества элементов на странице
const onItemsPerPageChange = () => {
  emit('update:itemsPerPage', itemsPerPage.value)
}

// Обработка сортировки
const handleSort = (columnKey: string) => {
  if (props.sorted?.key === columnKey) {
    emit('sort', {
      key: columnKey,
      direction: props.sorted.direction === 'asc' ? 'desc' : 'asc'
    })
  } else {
    emit('sort', {
      key: columnKey,
      direction: 'asc'
    })
  }
}

// Вычисляемые данные для отображения
const computedTotalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.ceil(
    props.pagination.totalItems / props.pagination.itemsPerPage
  )
})

const gridTemplateColumns = computed(() => ({
  'grid-template-columns': isEditMode.value
    ? `50px repeat(${props.meta.columns.length}, minmax(150px, 1fr))`
    : `repeat(${props.meta.columns.length}, minmax(150px, 1fr))`
}))

// Добавим функцию для получения паттерна валидации
const getValidationPattern = (
  validation?: ValidationMeta
): RegExp | null => {
  if (!validation) return null

  // Если указан тип валидации, используем его
  if (validation.type && validation.type !== 'custom') {
    return null // Паттерн будет использоваться из компонента InputText
  }

  // Если указан кастомный паттерн, используем его
  if (validation.pattern) {
    if (typeof validation.pattern === 'string') {
      try {
        return new RegExp(validation.pattern)
      } catch (e) {
        console.error('Invalid regex pattern:', e)
        return null
      }
    }
    return validation.pattern as RegExp
  }

  return null
}

// Update template text with translations
const toolbarTexts = computed(() => ({
  rowsPerPage: t('table.toolbar.rowsPerPage'),
  editMode: t('table.toolbar.editMode'),
  actions: {
    delete: t('table.toolbar.actions.delete'),
    copy: t('table.toolbar.actions.copy'),
    cancel: t('table.toolbar.actions.cancel'),
    save: t('table.toolbar.actions.save')
  }
}))

// Update validation messages
const getValidationMessage = (type: string, params?: any) => {
  return t(`table.validation.${type}`, params)
}

// Add new computed property for sort titles
const getSortTitle = (columnKey: string) => {
  if (props.sorted?.key === columnKey) {
    return props.sorted.direction === 'asc'
      ? t('table.sort.desc')
      : t('table.sort.asc')
  }
  return t('table.sort.asc')
}

// Add loading and error states
const loading = ref(false)
const error = ref(false)

// Update pagination text
const paginationText = computed(() => {
  if (!props.pagination) return ''

  const start =
    (props.pagination.currentPage - 1) * props.pagination.itemsPerPage + 1
  const end = Math.min(
    start + props.pagination.itemsPerPage - 1,
    props.pagination.totalItems
  )

  return `${t('table.pagination.showing')} ${start} ${t(
    'table.pagination.to'
  )} ${end} ${t('table.pagination.of')} ${props.pagination.totalItems} ${t(
    'table.pagination.entries'
  )}`
})
</script>

<style scoped>
.table-wrapper {
  width: 100%;
}

.table-container {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  overflow: auto;
}

.table-grid {
  display: grid;
}

.table-header-cell {
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.table-header-cell:last-child {
  border-right: none;
}

.table-cell {
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-cell:last-child {
  border-right: none;
}

.table-grid > :nth-last-child(-n + 5) {
  border-bottom: none;
}
</style>
