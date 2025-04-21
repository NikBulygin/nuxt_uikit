<template>
  <div class="w-full" :id="`${id}-container`">
    <!-- Label if provided -->
    <label
      v-if="label"
      :for="id"
      class="block mb-1 text-sm font-medium text-text-primary dark:text-dark-text-primary"
    >
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <!-- Date input wrapper -->
    <div class="absolute">
      <div
        :id="id"
        class="flex items-center border rounded-md overflow-hidden focus-within:ring-2"
        :class="[
          error
            ? 'border-danger focus-within:border-danger focus-within:ring-danger/20'
            : 'border-border dark:border-dark-border focus-within:border-primary focus-within:ring-primary/20',
          disabled
            ? 'bg-gray-100 dark:bg-dark-surface cursor-not-allowed opacity-70'
            : 'bg-background dark:bg-dark-background'
        ]"
      >
        <!-- Text input for date -->
        <input
          :id="`${id}-input`"
          type="text"
          :value="displayValue"
          :placeholder="placeholder || formatHint"
          :required="required"
          :disabled="disabled"
          class="w-full py-2 px-3 focus:outline-none bg-transparent text-text-primary dark:text-dark-text-primary"
          @input="onInputChange($event)"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeyDown"
        />

        <!-- Calendar icon button -->
        <button
          type="button"
          class="p-2 mr-1 flex items-center text-text-tertiary hover:text-text-primary dark:text-dark-text-tertiary dark:hover:text-dark-text-primary"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
          @click="handleCalendarClick"
          :aria-label="t('datePicker.aria.toggleCalendar')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      <!-- Datepicker popup -->
      <div
        v-if="showDatepicker"
        class="absolute z-10 mt-1 bg-white dark:bg-dark-surface shadow-lg rounded-md border border-border dark:border-dark-border"
        :class="[range ? 'w-[32rem]' : monthYearMode ? 'w-64' : 'w-72']"
        @click.stop=""
      >
        <!-- Datepicker header -->
        <div
          class="p-3 bg-gray-50 dark:bg-dark-background flex justify-between items-center border-b border-border dark:border-dark-border"
        >
          <button
            type="button"
            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover"
            @click="monthYearMode ? previousYear : previousMonth"
            :aria-label="monthYearMode ? t('datePicker.aria.previousYear') : t('datePicker.aria.previousMonth')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <span v-if="monthYearMode" class="text-lg font-medium">{{ currentYear }}</span>
            <template v-else>
              <!-- Month select -->
              <select
                v-model="currentMonth"
                class="bg-transparent py-1 px-2 rounded border border-transparent hover:border-border dark:hover:border-dark-border focus:outline-none"
              >
                <option
                  v-for="(month, idx) in monthNames"
                  :key="idx"
                  :value="idx"
                >
                  {{ month }}
                </option>
              </select>

              <!-- Year select -->
              <select
                v-model="currentYear"
                class="bg-transparent py-1 px-2 rounded border border-transparent hover:border-border dark:hover:border-dark-border focus:outline-none"
              >
                <option
                  v-for="year in availableYears"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </template>
          </div>

          <button
            type="button"
            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover"
            @click="monthYearMode ? nextYear : nextMonth"
            :aria-label="monthYearMode ? t('datePicker.aria.nextYear') : t('datePicker.aria.nextMonth')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div class="flex">
          <!-- Month grid for month-year mode -->
          <div v-if="monthYearMode" class="p-2 grid grid-cols-4 gap-2 w-full">
            <button
              v-for="(month, index) in monthNames"
              :key="index"
              type="button"
              class="p-2 rounded-full text-sm flex items-center justify-center transition-colors"
              :class="{
                'bg-primary text-white': isSelectedMonth(index),
                'hover:bg-primary/10 text-text-primary dark:text-dark-text-primary': !isSelectedMonth(index),
                'opacity-50 cursor-not-allowed': isDisabledMonth(index)
              }"
              :disabled="isDisabledMonth(index)"
              @click="selectMonth(index)"
            >
              {{ month.slice(0, 3) }}
            </button>
          </div>

          <!-- Regular calendar for date mode -->
          <div v-else>
            <!-- First calendar -->
            <div class="p-2 flex-1">
              <!-- Day of week headers -->
              <div class="grid grid-cols-7 mb-1">
                <div
                  v-for="day in dayNames"
                  :key="day"
                  class="text-center text-xs font-medium text-text-tertiary dark:text-dark-text-tertiary py-1"
                >
                  {{ day }}
                </div>
              </div>

              <!-- Calendar days -->
              <div class="grid grid-cols-7 gap-1">
                <button
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  type="button"
                  class="h-8 w-8 flex items-center justify-center rounded-full text-sm"
                  :class="getDayClasses(day, 'start')"
                  :disabled="isDayDisabled(day)"
                  @click="selectDate(day)"
                  @mouseover="onDayHover(day)"
                >
                  {{ day.getDate() }}
                </button>
              </div>
            </div>

            <!-- Second calendar for range mode -->
            <div
              v-if="range"
              class="p-2 flex-1 border-l border-border dark:border-dark-border"
            >
              <!-- Day of week headers for second month -->
              <div class="grid grid-cols-7 mb-1">
                <div
                  v-for="day in dayNames"
                  :key="day"
                  class="text-center text-xs font-medium text-text-tertiary dark:text-dark-text-tertiary py-1"
                >
                  {{ day }}
                </div>
              </div>

              <!-- Calendar days for second month -->
              <div class="grid grid-cols-7 gap-1">
                <button
                  v-for="(day, index) in calendarDaysNextMonth"
                  :key="index"
                  type="button"
                  class="h-8 w-8 flex items-center justify-center rounded-full text-sm"
                  :class="getDayClasses(day, 'end')"
                  :disabled="isDayDisabled(day)"
                  @click="selectDate(day)"
                  @mouseover="onDayHover(day)"
                >
                  {{ day.getDate() }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Datepicker footer -->
        <div
          class="p-2 border-t border-border dark:border-dark-border flex justify-between"
        >
          <button
            type="button"
            class="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded"
            @click="monthYearMode ? selectCurrentMonth : selectToday"
          >
            {{ buttonTexts.today }}
          </button>
          <button
            v-if="(monthYearMode && selectedDate) || (!monthYearMode && (selectedDate || hoverDate))"
            type="button"
            class="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded"
            @click="clearSelection"
          >
            {{ buttonTexts.clear }}
          </button>
          <button
            type="button"
            class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
            @click="applySelection"
          >
            {{ buttonTexts.apply }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error message (shown below input) -->
    <div v-if="error" class="mt-1 text-sm text-danger">
      {{ error }}
    </div>

    <!-- Helper text slot (shown when no error) -->
    <div
      v-else-if="$slots.helper"
      class="mt-1 text-sm text-text-tertiary dark:text-dark-text-tertiary"
    >
      <slot name="helper"></slot>
    </div>

    <!-- Fallback for helper text prop (for backward compatibility) -->
    <div
      v-else-if="helperText"
      class="mt-1 text-sm text-text-tertiary dark:text-dark-text-tertiary"
    >
      {{ helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useNotification } from '~/composables/useNotification'
import { useI18n } from 'vue-i18n'
import { withDefaults } from 'vue'

type DateValue = Date | null
type DateRange = [DateValue, DateValue]
type DateFormatPattern =
  | 'MM/DD/YYYY'
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'DD.MM.YYYY'
  | string

interface DateProps {
  modelValue: DateValue | DateRange
  label?: string
  placeholder?: string
  id?: string
  dateFormat?: DateFormatPattern
  required?: boolean
  disabled?: boolean
  range?: boolean
  minDate?: Date | string
  maxDate?: Date | string
  disabledDates?: Array<Date | string>
  validateOnInput?: boolean
  helperText?: string
  showNotificationOnError?: boolean
  monthYearMode?: boolean
}

const props = withDefaults(defineProps<DateProps>(), {
  id: undefined,
  dateFormat: 'MM/DD/YYYY',
  range: false,
  required: false,
  disabled: false,
  validateOnInput: false,
  showNotificationOnError: false,
  monthYearMode: false
})

const emit = defineEmits([
  'update:modelValue',
  'valid',
  'error',
  'focus',
  'blur'
])

// Local state
const inputValue = ref('')
const error = ref('')
const showDatepicker = ref(false)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref<Date | null>(null)
const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)
const hoverDate = ref<Date | null>(null)
const isValid = ref(false)

// Notification service
const notification = useNotification()

// Add i18n
const { t } = useI18n()

// Generate a stable ID based on component instance
const componentId = ref(
  props.id || `date-input-${Date.now().toString(36)}`
)

// Use the stable ID reference throughout the component
const id = computed(() => componentId.value)

// Calculate date format hint based on dateFormat
const formatHint = computed(() => {
  const format = props.dateFormat || 'MM/DD/YYYY'
  return format
    .replace('MM', 'mm')
    .replace('DD', 'dd')
    .replace('YYYY', 'yyyy')
})

// Get the actual min date as a Date object
const minDate = computed(() => {
  if (!props.minDate) return null
  return typeof props.minDate === 'string'
    ? parseDate(props.minDate)
    : props.minDate
})

// Get the actual max date as a Date object
const maxDate = computed(() => {
  if (!props.maxDate) return null
  return typeof props.maxDate === 'string'
    ? parseDate(props.maxDate)
    : props.maxDate
})

// Convert disabledDates strings to Date objects
const disabledDatesArray = computed(() => {
  if (!props.disabledDates) return []
  return props.disabledDates
    .map(date => {
      return typeof date === 'string' ? parseDate(date) : date
    })
    .filter(Boolean) as Date[]
})

// Replace static month names with i18n
const monthNames = [
  t('datePicker.months.january'),
  t('datePicker.months.february'),
  t('datePicker.months.march'),
  t('datePicker.months.april'),
  t('datePicker.months.may'),
  t('datePicker.months.june'),
  t('datePicker.months.july'),
  t('datePicker.months.august'),
  t('datePicker.months.september'),
  t('datePicker.months.october'),
  t('datePicker.months.november'),
  t('datePicker.months.december')
]

// Replace static day names with i18n
const dayNames = computed(() => t('datePicker.weekDays.short'))

// Update template button texts
const buttonTexts = computed(() => ({
  today: props.monthYearMode ? t('datePicker.buttons.current') : t('datePicker.buttons.today'),
  clear: t('datePicker.buttons.clear'),
  apply: t('datePicker.buttons.apply')
}))

// Available years for the dropdown (from min date to max date, or ±10 years)
const availableYears = computed(() => {
  const years = []
  const minYear = minDate.value
    ? minDate.value.getFullYear()
    : currentYear.value - 10
  const maxYear = maxDate.value
    ? maxDate.value.getFullYear()
    : currentYear.value + 10

  for (let year = minYear; year <= maxYear; year++) {
    years.push(year)
  }
  return years
})

// Calendar days for the current month/year
const calendarDays = computed(() => {
  return getDaysInMonth(currentYear.value, currentMonth.value)
})

// Calendar days for the next month (used in range mode)
const calendarDaysNextMonth = computed(() => {
  let month = currentMonth.value + 1
  let year = currentYear.value

  if (month > 11) {
    month = 0
    year++
  }

  return getDaysInMonth(year, month)
})

// Display value formatted according to the specified format
const displayValue = computed(() => {
  if (props.range) {
    if (selectedStartDate.value && selectedEndDate.value) {
      return `${formatDate(selectedStartDate.value)} - ${formatDate(
        selectedEndDate.value
      )}`
    } else if (selectedStartDate.value) {
      return `${formatDate(selectedStartDate.value)} - ${
        props.placeholder || formatHint.value
      }`
    }
    return inputValue.value
  } else {
    if (selectedDate.value) {
      return formatDate(selectedDate.value)
    }
    return inputValue.value
  }
})

// Format a date according to the specified dateFormat
function formatDate(date: Date): string {
  if (!date) return ''

  const format = props.dateFormat || 'MM/DD/YYYY'
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  if (props.monthYearMode) {
    return format
      .replace('DD', '01')
      .replace('MM', month)
      .replace('YYYY', year.toString())
  }

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString())
}

// Parse a date string according to the specified dateFormat
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  const format = props.dateFormat || 'MM/DD/YYYY'
  let day, month, year

  if (props.monthYearMode) {
    const parts = dateStr.split(/[-/.]/)
    if (parts.length === 2) {
      month = parseInt(parts[0]) - 1
      year = parseInt(parts[1])
      day = 1
    } else {
      return null
    }
  } else if (
    format.indexOf('DD') !== -1 &&
    format.indexOf('MM') !== -1 &&
    format.indexOf('YYYY') !== -1
  ) {
    const dayIndex = format.indexOf('DD')
    const monthIndex = format.indexOf('MM')
    const yearIndex = format.indexOf('YYYY')

    // Extract parts based on the format
    const separators = format.replace(/[DMY]/g, '')
    let parts

    if (separators.length > 0) {
      const separatorRegex = new RegExp(`[${separators}]`)
      parts = dateStr.split(separatorRegex)
    } else {
      // Handle formats without separators (e.g., MMDDYYYY)
      parts = []
      if (dayIndex !== -1)
        parts[dayIndex / 2] = dateStr.substring(dayIndex, dayIndex + 2)
      if (monthIndex !== -1)
        parts[monthIndex / 2] = dateStr.substring(
          monthIndex,
          monthIndex + 2
        )
      if (yearIndex !== -1)
        parts[yearIndex / 4] = dateStr.substring(yearIndex, yearIndex + 4)
    }

    // Map parts to day, month, year based on format indices
    const positions = [
      { index: dayIndex, value: 'day' },
      { index: monthIndex, value: 'month' },
      { index: yearIndex, value: 'year' }
    ].sort((a, b) => a.index - b.index)

    day = parseInt(parts[positions.findIndex(p => p.value === 'day')])
    month =
      parseInt(parts[positions.findIndex(p => p.value === 'month')]) - 1 // JS months are 0-based
    year = parseInt(parts[positions.findIndex(p => p.value === 'year')])
  } else {
    // Fallback to browser date parsing (less reliable)
    const parsed = new Date(dateStr)
    if (isNaN(parsed.getTime())) return null
    day = parsed.getDate()
    month = parsed.getMonth()
    year = parsed.getFullYear()
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null

  const date = new Date(year, month, day)

  // Validate that the parsed date is valid
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    (props.monthYearMode ? false : date.getDate() !== day)
  ) {
    return null
  }

  return date
}

// Get all days in a month as Date objects
function getDaysInMonth(year: number, month: number): Date[] {
  const days = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Add padding days from previous month
  const firstDayOfWeek = firstDay.getDay()
  if (firstDayOfWeek > 0) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i))
    }
  }

  // Add days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  // Add padding days from next month
  const lastDayOfWeek = lastDay.getDay()
  if (lastDayOfWeek < 6) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year

    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      days.push(new Date(nextYear, nextMonth, i))
    }
  }

  return days
}

// Check if a day is disabled
function isDayDisabled(day: Date): boolean {
  // Check min date
  if (minDate.value && day < minDate.value) {
    return true
  }

  // Check max date
  if (maxDate.value && day > maxDate.value) {
    return true
  }

  // Check disabled dates
  if (
    disabledDatesArray.value.some(
      disabledDate =>
        disabledDate.getFullYear() === day.getFullYear() &&
        disabledDate.getMonth() === day.getMonth() &&
        disabledDate.getDate() === day.getDate()
    )
  ) {
    return true
  }

  return false
}

// Check if day is in the current month
function isCurrentMonth(day: Date, position: 'start' | 'end'): boolean {
  const targetMonth =
    position === 'start'
      ? currentMonth.value
      : (currentMonth.value + 1) % 12
  return day.getMonth() === targetMonth
}

// Fix for the isDateInRange function to properly handle null values
const isDateInRange = (
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!startDate || !endDate) return false

  return date >= startDate && date <= endDate
}

// Fix for the getDayClasses function
const getDayClasses = (
  day: Date,
  calendarType: 'start' | 'end' = 'start'
) => {
  const isSelected =
    isSameDay(day, selectedDate.value) ||
    isSameDay(day, selectedStartDate.value) ||
    isSameDay(day, selectedEndDate.value)

  const isToday = isSameDay(day, new Date())
  const isOtherMonth = day.getMonth() !== currentMonth.value

  // Fixed: Add null checks for range-related values
  const isRangeStart =
    props.range && selectedStartDate.value
      ? isSameDay(day, selectedStartDate.value)
      : false

  const isRangeEnd =
    props.range && selectedEndDate.value
      ? isSameDay(day, selectedEndDate.value)
      : false

  const isInRange =
    props.range && selectedStartDate.value
      ? isDateInRange(
          day,
          selectedStartDate.value,
          hoverDate.value ||
            selectedEndDate.value ||
            selectedStartDate.value
        )
      : false

  const isDisabled = isDayDisabled(day)

  return {
    'bg-primary text-white': Boolean(isSelected),
    'bg-primary/20 text-primary': isToday && !isSelected,
    'bg-primary/10': Boolean(isInRange) && !isSelected,
    'text-text-tertiary dark:text-dark-text-tertiary':
      !isSelected && isOtherMonth,
    'text-text-primary dark:text-dark-text-primary':
      !isSelected && !isOtherMonth && !isToday,
    'opacity-50 cursor-not-allowed': isDisabled,
    'rounded-l-full': Boolean(isRangeStart),
    'rounded-r-full': Boolean(isRangeEnd),
    'hover:bg-primary/5': !isSelected && !isDisabled
  }
}

// Check if two dates represent the same day
function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Navigate to previous month
function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// Navigate to next month
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Select today's date
function selectToday() {
  const today = new Date()

  if (isDayDisabled(today)) {
    error.value = t('datePicker.validation.todayNotAvailable')
    if (props.showNotificationOnError) {
      notification.warning(error.value, 'Date Selection')
    }
    return
  }

  if (props.range) {
    if (!selectedStartDate.value || selectedEndDate.value) {
      selectedStartDate.value = today
      selectedEndDate.value = null
    } else {
      if (today < selectedStartDate.value) {
        selectedEndDate.value = selectedStartDate.value
        selectedStartDate.value = today
      } else {
        selectedEndDate.value = today
      }
    }
  } else {
    selectedDate.value = today
  }

  updateModelValue()
}

// Clear date selection
function clearSelection() {
  if (props.range) {
    selectedStartDate.value = null
    selectedEndDate.value = null
  } else {
    selectedDate.value = null
  }

  inputValue.value = ''
  hoverDate.value = null
  updateModelValue()
}

// Select a specific date from the calendar
function selectDate(day: Date) {
  if (isDayDisabled(day)) return

  if (props.monthYearMode) {
    const selectedDate = new Date(day.getFullYear(), day.getMonth(), 1)
    if (props.range) {
      if (!selectedStartDate.value || selectedEndDate.value) {
        selectedStartDate.value = selectedDate
        selectedEndDate.value = null
      } else {
        if (selectedDate < selectedStartDate.value) {
          selectedEndDate.value = selectedStartDate.value
          selectedStartDate.value = selectedDate
        } else {
          selectedEndDate.value = selectedDate
        }
      }
    } else {
      selectedDate.value = selectedDate
      applySelection()
    }
  } else {
    if (props.range) {
      if (!selectedStartDate.value || selectedEndDate.value) {
        selectedStartDate.value = day
        selectedEndDate.value = null
      } else {
        if (day < selectedStartDate.value) {
          selectedEndDate.value = selectedStartDate.value
          selectedStartDate.value = day
        } else {
          selectedEndDate.value = day
        }
      }
    } else {
      selectedDate.value = day
      applySelection()
    }
  }

  updateModelValue()
}

// Handle hovering over days for range selection
function onDayHover(day: Date) {
  if (props.range && selectedStartDate.value && !selectedEndDate.value) {
    hoverDate.value = day
  }
}

// Apply the selection and close the datepicker
function applySelection() {
  showDatepicker.value = false
  updateModelValue()
  validateInput()
}

// Toggle the datepicker visibility
function toggleDatepicker() {
  showDatepicker.value = !showDatepicker.value
  console.log('Toggling datepicker:', showDatepicker.value)
}

// Add button click handler function to ensure proper evaluation
function handleCalendarClick() {
  if (!props.disabled) {
    toggleDatepicker()
  }
}

// Handle manual input change
function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  inputValue.value = input.value

  if (props.validateOnInput) {
    validateInput()
  }

  // Try to parse single date or date range
  if (props.range) {
    const parts = inputValue.value.split('-').map(part => part.trim())
    if (parts.length === 2) {
      const start = parseDate(parts[0])
      const end = parseDate(parts[1])

      if (start && end) {
        selectedStartDate.value = start
        selectedEndDate.value = end
        updateModelValue()
      }
    }
  } else {
    const date = parseDate(inputValue.value)
    if (date) {
      selectedDate.value = date
      updateModelValue()
    }
  }
}

// Keyboard event handling
function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === 'Escape') {
    if (showDatepicker.value) {
      showDatepicker.value = false
      event.preventDefault()
    }
  }
}

// Focus handler
function onFocus() {
  emit('focus')
}

// Blur handler
function onBlur() {
  validateInput()
  emit('blur')
}

// Update the model value based on current selection
function updateModelValue() {
  if (props.range) {
    // For range mode
    const dateRange: DateRange = [
      selectedStartDate.value,
      selectedEndDate.value
    ]
    emit('update:modelValue', dateRange)
  } else {
    // For single date mode
    emit('update:modelValue', selectedDate.value)
  }
}

// Validate the entered date
function validateInput() {
  error.value = ''
  isValid.value = false

  if (props.required) {
    if (props.range) {
      if (!selectedStartDate.value || !selectedEndDate.value) {
        error.value = t('datePicker.validation.requiredRange')
        emit('error', error.value)
        return
      }
    } else {
      if (!selectedDate.value) {
        error.value = t('datePicker.validation.required')
        emit('error', error.value)
        return
      }
    }
  }

  if (inputValue.value && !selectedDate.value && !props.range) {
    error.value = t('datePicker.validation.invalidFormat', { format: formatHint.value })
    emit('error', error.value)
    return
  }

  if (
    props.range &&
    inputValue.value &&
    (!selectedStartDate.value || !selectedEndDate.value)
  ) {
    error.value = t('datePicker.validation.invalidRangeFormat', { format: formatHint.value })
    emit('error', error.value)
    return
  }

  isValid.value = true
  emit('valid', true)
}

// Close datepicker when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (showDatepicker.value && !target.closest(`#${id.value}`)) {
    showDatepicker.value = false
  }
}

// Initialize component based on modelValue
function initializeFromModelValue() {
  if (props.range && Array.isArray(props.modelValue)) {
    selectedStartDate.value = props.modelValue[0]
    selectedEndDate.value = props.modelValue[1]

    if (selectedStartDate.value) {
      currentMonth.value = selectedStartDate.value.getMonth()
      currentYear.value = selectedStartDate.value.getFullYear()
    }
  } else if (
    !props.range &&
    props.modelValue &&
    !Array.isArray(props.modelValue)
  ) {
    selectedDate.value = props.modelValue

    if (selectedDate.value) {
      currentMonth.value = selectedDate.value.getMonth()
      currentYear.value = selectedDate.value.getFullYear()
    }
  }
}

// Watch for model value changes from parent
watch(
  () => props.modelValue,
  () => {
    initializeFromModelValue()
  }
)

// Watch for month/year changes
watch([() => currentMonth.value, () => currentYear.value], () => {
  // If current month/year is outside available range, adjust
  if (minDate.value) {
    const minYear = minDate.value.getFullYear()
    const minMonth = minDate.value.getMonth()

    if (
      currentYear.value < minYear ||
      (currentYear.value === minYear && currentMonth.value < minMonth)
    ) {
      currentYear.value = minYear
      currentMonth.value = minMonth
    }
  }

  if (maxDate.value) {
    const maxYear = maxDate.value.getFullYear()
    const maxMonth = maxDate.value.getMonth()

    if (
      currentYear.value > maxYear ||
      (currentYear.value === maxYear && currentMonth.value > maxMonth)
    ) {
      currentYear.value = maxYear
      currentMonth.value = maxMonth
    }
  }
})

// Add click outside handler
onMounted(() => {
  initializeFromModelValue()
  document.addEventListener('click', handleClickOutside)
})

// Clean up
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Add new methods for month-year mode
function previousYear() {
  currentYear.value--
}

function nextYear() {
  currentYear.value++
}

function isSelectedMonth(monthIndex: number): boolean {
  if (!selectedDate.value) return false
  return selectedDate.value.getMonth() === monthIndex && 
         selectedDate.value.getFullYear() === currentYear.value
}

function isDisabledMonth(monthIndex: number): boolean {
  if (!minDate.value && !maxDate.value) return false

  const firstDayOfMonth = new Date(currentYear.value, monthIndex, 1)
  const lastDayOfMonth = new Date(currentYear.value, monthIndex + 1, 0)

  if (minDate.value && lastDayOfMonth < minDate.value) return true
  if (maxDate.value && firstDayOfMonth > maxDate.value) return true

  return false
}

function selectMonth(monthIndex: number) {
  if (isDisabledMonth(monthIndex)) return
  
  const newDate = new Date(currentYear.value, monthIndex, 1)
  selectedDate.value = newDate
  applySelection()
}

function selectCurrentMonth() {
  const now = new Date()
  selectMonth(now.getMonth())
  currentYear.value = now.getFullYear()
}
</script>
