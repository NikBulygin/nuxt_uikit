<template>
<<<<<<< HEAD
  <input-date v-model="date" id="page-date-picker" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputDate from '@/components/primitive/input/date.vue'

const date = ref<Date | null>(null)
=======
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const sorted = ref<{ key: string; direction: 'asc' | 'desc' } | undefined>()

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
  // Здесь вы можете получить данные по индексам и создать копии
  const copiedData = selectedIndices.map(index => ({...data.value[index]}))
  data.value.push(...copiedData)
}

const onDelete = (selectedIndices: number[]) => {
  console.log('Delete event:', selectedIndices)
  // Удаляем строки в обратном порядке, чтобы не нарушить индексы
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
  
  // Обновляем существующие строки
  Object.entries(changes.edited).forEach(([index, rowData]) => {
    data.value[parseInt(index)] = rowData
  })
  
  // Добавляем новые строки
  data.value.push(...changes.new)
}

const onSort = (sortData: { key: string; direction: 'asc' | 'desc' }) => {
  sorted.value = sortData
  // Здесь можно реализовать сортировку данных
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
>>>>>>> 18757a6 (Add table form)
</script>
