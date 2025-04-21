<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <ThemeToggle />
    </div>

    <div class="mt-8">
      <h2 class="text-h2 mb-4 text-light-text-primary dark:text-dark-text-primary">Данные по вагонам</h2>
      <container-table
        v-model="tableData"
        :columns="columns"
        @changed="handleTableChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ContainerTable from '@/components/container/table/index.vue'

interface TableRow {
  wagonNumber: string
  weight: number
  tio2: number
  h2o: number
  recalculation: number
  totalWeight: number
  invoiceNumber: string
  invoiceDate: Date | null
  gtdNumber: string
  gtdDate: Date | null
}

interface Column {
  key: string
  label: string
  type: 'float' | 'text' | 'number' | 'date' | 'file'
  editable?: boolean
  computed?: boolean
}

const columns: Column[] = [
  { key: 'wagonNumber', label: 'Номер вагона', type: 'text', editable: true },
  { key: 'weight', label: 'Вес', type: 'float', editable: true },
  { key: 'tio2', label: 'TiO2', type: 'float', editable: true },
  { key: 'h2o', label: 'H2O', type: 'float', editable: true },
  { key: 'recalculation', label: 'Перерасчет', type: 'float', computed: true },
  { key: 'totalWeight', label: 'Вес итог', type: 'float', computed: true },
  { key: 'invoiceNumber', label: 'Номер инвойса', type: 'text', editable: true },
  { key: 'invoiceDate', label: 'Дата инвойса', type: 'date', editable: true },
  { key: 'gtdNumber', label: 'ГТД номер', type: 'text', editable: true },
  { key: 'gtdDate', label: 'ГТД дата', type: 'date', editable: true }
]

const tableData = ref<TableRow[]>([
  {
    wagonNumber: '',
    weight: 0,
    tio2: 0,
    h2o: 0,
    recalculation: 0,
    totalWeight: 0,
    invoiceNumber: '',
    invoiceDate: null,
    gtdNumber: '',
    gtdDate: null
  }
])

// Вычисляемые значения
const computedData = computed(() => {
  const data = [...tableData.value]
  
  // Вычисляем перерасчет для каждой строки
  data.forEach(row => {
    row.recalculation = Number(
      ((row.weight * (100 - row.h2o) * row.tio2) / 4200).toFixed(2)
    )
  })

  // Группируем по номеру инвойса для подсчета общего веса
  const invoiceGroups = data.reduce((acc, row) => {
    if (!acc[row.invoiceNumber]) {
      acc[row.invoiceNumber] = data
        .filter(r => r.invoiceNumber === row.invoiceNumber)
        .reduce((sum, r) => sum + r.weight, 0)
    }
    return acc
  }, {} as Record<string, number>)

  // Применяем групповые суммы
  data.forEach(row => {
    row.totalWeight = invoiceGroups[row.invoiceNumber] || 0
  })

  return data
})

// Обработчик изменений
const handleTableChange = ({ rowIndex, key, value }: { rowIndex: number, key: string, value: any }) => {
  const newData = [...tableData.value]
  newData[rowIndex] = { ...newData[rowIndex], [key]: value }
  
  // Обновляем все вычисляемые значения
  tableData.value = computedData.value
}
</script>
