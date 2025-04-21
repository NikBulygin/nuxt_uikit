<template>
  <div>
      <div>
    <button v-for="locale in locales" @click="setLocale(locale.code)">
      {{ locale.name }}
    </button>
    <h1>{{ $t('welcome') }}</h1>
    
      {{ $t('table.toolbar.editMode') }}
  </div>
    <!-- Language selector -->
    <div class="mb-4">
      <label class="block mb-2 text-sm font-medium">{{ t('language.select') }}</label>
      <select v-model="locale" class="p-2 border rounded">
        <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code">
          {{ loc.name }}
        </option>
      </select>
    </div>

    <!-- Date picker examples -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Standard date picker -->
      <div class="p-4 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Standard Date Picker</h3>
        <date-input
          v-model="standardDate"
          label="Select Date"
          date-format="DD.MM.YYYY"
          :required="true"
          :helper-text="'Standard date picker with DD.MM.YYYY format'"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected value: {{ standardDate }}
        </div>
      </div>

      <!-- Month-Year picker -->
      <div class="p-4 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Month-Year Picker</h3>
        <date-input
          v-model="monthYearDate"
          label="Select Month and Year"
          date-format="MM/YYYY"
          :month-year-mode="true"
          :helper-text="'Month and year selection only'"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected value: {{ monthYearDate }}
        </div>
      </div>

      <!-- Date range picker -->
      <div class="p-4 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Date Range Picker</h3>
        <date-input
          v-model="dateRange"
          label="Select Date Range"
          date-format="YYYY-MM-DD"
          :range="true"
          :helper-text="'Select start and end dates'"
        />
        <div class="mt-2 text-sm text-gray-600">
          Start: {{ dateRange[0] }}<br>
          End: {{ dateRange[1] }}
        </div>
      </div>

      <!-- Date picker with min/max -->
      <div class="p-4 border rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Date Picker with Constraints</h3>
        <date-input
          v-model="constrainedDate"
          label="Select Date (Limited Range)"
          date-format="DD/MM/YYYY"
          :min-date="minDate"
          :max-date="maxDate"
          :helper-text="'Date selection limited to current month'"
        />
        <div class="mt-2 text-sm text-gray-600">
          Selected value: {{ constrainedDate }}
        </div>
      </div>
    </div>

    <!-- Table component -->
    <container-table 
      :meta="meta" 
      :data="data" 
      :pagination="pagination"
      :sorted="sorted"
      @copy="onCopy"
      @delete="onDelete"
      @update:itemsPerPage="onUpdateItemsPerPage"
      @update:page="onUpdatePage"
      @save="onSave"
      @sort="onSort"
      @add="onAdd"
    /> 
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DateInput from '~/components/primitive/input/date.vue'

const { locales, setLocale, availableLocales } = useI18n()

const { locale, t } = useI18n()
const sorted = ref<{ key: string; direction: 'asc' | 'desc' } | undefined>()

// Date picker examples data
const standardDate = ref<Date | null>(null)
const monthYearDate = ref<Date | null>(null)
const dateRange = ref<[Date | null, Date | null]>([null, null])
const constrainedDate = ref<Date | null>(null)

// Min/Max dates for constrained picker
const minDate = computed(() => {
  const date = new Date()
  date.setDate(1) // First day of current month
  return date
})

const maxDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1, 0) // Last day of current month
  return date
})

const meta = reactive({
  columns: [
    { 
      key: 'name', 
      title: 'Name', 
      type: 'text',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        type: 'lettersOnly'
      }
    },
    { 
      key: 'lastname', 
      title: 'Lastname', 
      type: 'text',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        type: 'lettersOnly'
      }
    },
    { 
      key: 'formula_test', 
      title: 'Formula test', 
      type: 'formula', 
      formula: (row) => row.name + ' ' + row.lastname 
    },
    { 
      key: 'age', 
      title: 'Age', 
      type: 'number',
      validation: {
        required: true,
        min: 0,
        max: 40
      }
    },
    { 
      key: 'email', 
      title: 'Email', 
      type: 'text',
      validation: {
        required: true,
        type: 'email'
      }
    },
    { 
      key: 'date', 
      title: 'Date', 
      type: 'date',
      validation: {
        required: true,
        format: 'YYYY-MM-DD'
      }
    },
  ],
})

const data = ref([
  { name: 'John', lastname: 'Doe', age: 30, email: 'john.doe@example.com', date: '2021-01-01' },
  { name: 'Jane', lastname: 'Smith', age: 25, email: 'jane.smith@example.com', date: '2021-01-02' },
])

const pagination = reactive({
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 1000,
})

// Event handlers
const onCopy = (selectedIndices: number[]) => {
  console.log('Copy event:', selectedIndices)
  const copiedData = selectedIndices.map(index => ({...data.value[index]}))
  data.value.push(...copiedData)
}

const onDelete = (selectedIndices: number[]) => {
  console.log('Delete event:', selectedIndices)
  selectedIndices.sort((a, b) => b - a).forEach(index => {
    data.value.splice(index, 1)
  })
}

const onUpdateItemsPerPage = (newItemsPerPage: number) => {
  pagination.itemsPerPage = newItemsPerPage
}

const onUpdatePage = (newPage: number) => {
  pagination.currentPage = newPage
}

const onSave = (changes: { edited: { [key: number]: any }, new: any[] }) => {
  console.log('Save changes:', changes)
  
  Object.entries(changes.edited).forEach(([index, rowData]) => {
    data.value[parseInt(index)] = rowData
  })
  
  data.value.push(...changes.new)
}

const onSort = (sortData: { key: string; direction: 'asc' | 'desc' }) => {
  sorted.value = sortData
  data.value.sort((a, b) => {
    const aVal = a[sortData.key]
    const bVal = b[sortData.key]
    const direction = sortData.direction === 'asc' ? 1 : -1
    
    if (aVal < bVal) return -1 * direction
    if (aVal > bVal) return 1 * direction
    return 0
  })
}

const onAdd = (newRowData: any) => {
  console.log('Add new row:', newRowData)
  data.value.push(newRowData)
}
</script>
