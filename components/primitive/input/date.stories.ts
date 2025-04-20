import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DateInput from './date.vue'
import { useNotification } from '../../../composables/useNotification'

const meta = {
  title: 'Primitive/Input/Date',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'object',
      description: 'Date value or range [startDate, endDate]'
    },
    label: {
      control: 'text',
      description: 'Input label'
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder'
    },
    dateFormat: {
      control: 'select',
      options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'],
      description: 'Date format pattern'
    },
    range: {
      control: 'boolean',
      description: 'Enable date range selection'
    },
    minDate: {
      control: 'date',
      description: 'Minimum selectable date'
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date'
    },
    disabledDates: {
      control: 'array',
      description: 'Array of dates to disable'
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input'
    },
    helperText: {
      control: 'text',
      description:
        'Helper text displayed below the input (use helper slot for rich content)'
    },
    validateOnInput: {
      control: 'boolean',
      description: 'Validate while typing'
    },
    showNotificationOnError: {
      control: 'boolean',
      description: 'Show notification on validation error'
    }
  }
} satisfies Meta<typeof DateInput>

export default meta
type Story = StoryObj<typeof meta>

// Basic date input
export const Default: Story = {
  args: {
    modelValue: null,
    label: 'Select Date',
    placeholder: 'Select or enter a date',
    dateFormat: 'MM/DD/YYYY'
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<DateInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :date-format="args.dateFormat"
    >
      <template #helper>
        Click the calendar icon to select a date
      </template>
    </DateInput>
    <div v-if="value" class="mt-2">
      Selected date: {{ value.toLocaleDateString() }}
    </div>`
  })
}

// Date input with various formats
export const DateFormats: Story = {
  args: {
    modelValue: new Date(),
    label: 'Date with Custom Format',
    dateFormat: 'DD/MM/YYYY'
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref(args.modelValue)
      const formats = [
        'MM/DD/YYYY',
        'DD/MM/YYYY',
        'YYYY-MM-DD',
        'DD.MM.YYYY'
      ]
      const selectedFormat = ref(args.dateFormat)

      return { args, value, formats, selectedFormat }
    },
    template: `<div>
      <div class="mb-2">
        <label class="block text-sm mb-1">Format:</label>
        <select v-model="selectedFormat" class="border p-2 rounded">
          <option v-for="format in formats" :key="format" :value="format">
            {{ format }}
          </option>
        </select>
      </div>
      
      <DateInput 
        v-model="value"
        :label="args.label"
        :date-format="selectedFormat"
      >
        <template #helper>
          Using format: {{ selectedFormat }}
        </template>
      </DateInput>
    </div>`
  })
}

// Date range selection
export const DateRange: Story = {
  args: {
    modelValue: [null, null],
    label: 'Date Range',
    range: true,
    dateFormat: 'MM/DD/YYYY',
    validateOnInput: true
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref<[Date | null, Date | null]>([null, null])
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && value.value[0] && value.value[1]) {
          notification.success(
            `Selected range: ${value.value[0].toLocaleDateString()} - ${value.value[1].toLocaleDateString()}`,
            'Valid Date Range'
          )
        }
      }

      return { args, value, handleValid }
    },
    template: `<DateInput 
      v-model="value"
      :label="args.label"
      :range="args.range"
      :date-format="args.dateFormat"
      :validate-on-input="args.validateOnInput"
      @valid="handleValid"
    >
      <template #helper>
        Select a start and end date for your reservation
      </template>
    </DateInput>
    <div v-if="value[0] && value[1]" class="mt-2">
      Selected range: {{ value[0].toLocaleDateString() }} - {{ value[1].toLocaleDateString() }}
    </div>`
  })
}

// Min/Max date constraints
export const MinMaxDates: Story = {
  args: {
    modelValue: null,
    label: 'Arrival Date',
    minDate: new Date(), // Today
    maxDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
    dateFormat: 'MM/DD/YYYY',
    showNotificationOnError: true
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref(args.modelValue)
      const today = new Date()
      const threeMonthsLater = new Date(today)
      threeMonthsLater.setMonth(today.getMonth() + 3)

      return {
        args,
        value,
        today,
        threeMonthsLater,
        formatDate: (date: Date) => date.toLocaleDateString()
      }
    },
    template: `<DateInput 
      v-model="value"
      :label="args.label"
      :min-date="today"
      :max-date="threeMonthsLater"
      :date-format="args.dateFormat"
      :show-notification-on-error="args.showNotificationOnError"
    >
      <template #helper>
        Select a date between {{ formatDate(today) }} and {{ formatDate(threeMonthsLater) }}
      </template>
    </DateInput>`
  })
}

// Disabled specific dates
export const DisabledDates: Story = {
  args: {
    modelValue: null,
    label: 'Appointment Date',
    dateFormat: 'MM/DD/YYYY',
    validateOnInput: true
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref(args.modelValue)

      // Create some disabled dates (e.g., weekends for the next month)
      const disabledDates = []
      const today = new Date()
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)

      // Disable all Saturdays and Sundays for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        // If weekend (0 = Sunday, 6 = Saturday)
        if (date.getDay() === 0 || date.getDay() === 6) {
          disabledDates.push(new Date(date))
        }
      }

      return { args, value, disabledDates }
    },
    template: `<DateInput 
      v-model="value"
      :label="args.label"
      :date-format="args.dateFormat"
      :disabled-dates="disabledDates"
      :validate-on-input="args.validateOnInput"
    >
      <template #helper>
        Weekends are not available for appointments
      </template>
    </DateInput>`
  })
}

// Required date input
export const Required: Story = {
  args: {
    modelValue: null,
    label: 'Birth Date',
    dateFormat: 'MM/DD/YYYY',
    required: true,
    validateOnInput: true,
    showNotificationOnError: true
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref<Date | null>(null)
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && value.value) {
          notification.success(
            `Birth date confirmed: ${value.value.toLocaleDateString()}`,
            'Valid Date'
          )
        }
      }

      return { args, value, handleValid }
    },
    template: `<DateInput 
      v-model="value"
      :label="args.label"
      :date-format="args.dateFormat"
      :required="args.required"
      :validate-on-input="args.validateOnInput"
      :show-notification-on-error="args.showNotificationOnError"
      @valid="handleValid"
    >
      <template #helper>
        Your birth date is required
      </template>
    </DateInput>`
  })
}

// Disabled date input
export const Disabled: Story = {
  args: {
    modelValue: new Date(),
    label: 'Registration Date',
    dateFormat: 'MM/DD/YYYY',
    disabled: true
  },
  render: args => ({
    components: { DateInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<DateInput 
      v-model="value"
      :label="args.label"
      :date-format="args.dateFormat"
      :disabled="args.disabled"
    >
      <template #helper>
        Registration date cannot be modified
      </template>
    </DateInput>`
  })
}
