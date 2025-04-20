import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FloatInput from './float.vue'
import { useNotification } from '../../../composables/useNotification'

const meta = {
  title: 'Primitive/Input/Float',
  component: FloatInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'number',
      description: 'The input value'
    },
    label: {
      control: 'text',
      description: 'Input label'
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder'
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value'
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value'
    },
    precision: {
      control: 'number',
      description: 'Number of decimal places'
    },
    displayMode: {
      control: 'select',
      options: ['full', 'first', 'last', 'firstLast', 'scientific'],
      description: 'How to display the formatted value'
    },
    displayDigits: {
      control: 'number',
      description: 'Number of digits to display in truncated modes'
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
} satisfies Meta<typeof FloatInput>

export default meta
type Story = StoryObj<typeof meta>

// Basic float input
export const Default: Story = {
  args: {
    modelValue: 0.0,
    label: 'Price',
    placeholder: 'Enter price',
    precision: 2
  },
  render: args => ({
    components: { FloatInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<FloatInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :precision="args.precision"
    >
      <template #helper>
        Enter a price with {{ args.precision }} decimal places
      </template>
    </FloatInput>
    <div class="mt-2">Current price: \${{ value.toFixed(args.precision) }}</div>`
  })
}

// High precision float
export const HighPrecision: Story = {
  args: {
    modelValue: 3.14159265359,
    label: 'Pi',
    placeholder: 'Mathematical constant',
    precision: 10,
    min: 3,
    max: 4
  },
  render: args => ({
    components: { FloatInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<FloatInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :precision="args.precision"
      :min="args.min"
      :max="args.max"
    >
      <template #helper>
        High precision number ({{ args.precision }} decimal places)
      </template>
    </FloatInput>
    <div class="mt-2">Current value: {{ value }}</div>`
  })
}

// Scientific notation display
export const ScientificNotation: Story = {
  args: {
    modelValue: 0.0000000123,
    label: 'Atomic Scale',
    placeholder: 'Enter a very small number',
    precision: 6,
    displayMode: 'scientific'
  },
  render: args => ({
    components: { FloatInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<FloatInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :precision="args.precision"
      :display-mode="args.displayMode"
    >
      <template #helper>
        Displayed in scientific notation
      </template>
    </FloatInput>`
  })
}

// First digits display
export const FirstDigitsDisplay: Story = {
  args: {
    modelValue: 123.4567890123,
    label: 'Truncated Value',
    precision: 10,
    displayMode: 'first',
    displayDigits: 7
  },
  render: args => ({
    components: { FloatInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<FloatInput 
      v-model="value"
      :label="args.label"
      :precision="args.precision"
      :display-mode="args.displayMode"
      :display-digits="args.displayDigits"
    >
      <template #helper>
        Shows first {{ args.displayDigits }} digits with ellipsis
      </template>
    </FloatInput>`
  })
}

// First and last digits display
export const FirstLastDigitsDisplay: Story = {
  args: {
    modelValue: 123.4567890123,
    label: 'Partial Display',
    precision: 10,
    displayMode: 'firstLast',
    displayDigits: 8
  },
  render: args => ({
    components: { FloatInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<FloatInput 
      v-model="value"
      :label="args.label"
      :precision="args.precision"
      :display-mode="args.displayMode"
      :display-digits="args.displayDigits"
    >
      <template #helper>
        Shows first and last of {{ args.displayDigits }} total digits
      </template>
    </FloatInput>`
  })
}

// Float with min/max validation
export const MinMaxValidation: Story = {
  args: {
    modelValue: 25.5,
    label: 'Temperature',
    placeholder: 'Enter temperature',
    precision: 1,
    min: -10,
    max: 50,
    validateOnInput: true,
    showNotificationOnError: true
  },
  render: args => ({
    components: { FloatInput },
    setup() {
      const value = ref(args.modelValue)
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && value.value !== '') {
          notification.success(
            `Valid temperature: ${value.value}°C`,
            'Success'
          )
        }
      }

      return { args, value, handleValid }
    },
    template: `<FloatInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :precision="args.precision"
      :min="args.min"
      :max="args.max"
      :validate-on-input="args.validateOnInput"
      :show-notification-on-error="args.showNotificationOnError"
      @valid="handleValid"
    >
      <template #helper>
        Temperature must be between {{ args.min }}°C and {{ args.max }}°C
      </template>
    </FloatInput>
    <div class="mt-2">Current temperature: {{ value }}°C</div>`
  })
}
