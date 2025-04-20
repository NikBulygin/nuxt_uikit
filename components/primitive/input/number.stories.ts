import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import NumberInput from './number.vue'
import { useNotification } from '../../../composables/useNotification'

const meta = {
  title: 'Primitive/Input/Number',
  component: NumberInput,
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
    step: {
      control: 'number',
      description: 'Step increment/decrement value'
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
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

// Basic number input
export const Default: Story = {
  args: {
    modelValue: 0,
    label: 'Count',
    placeholder: 'Enter a number'
  },
  render: args => ({
    components: { NumberInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<NumberInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
    >
      <template #helper>
        Please enter a whole number
      </template>
    </NumberInput>
    <div class="mt-2">Current value: {{ value }}</div>`
  })
}

// Number input with min/max constraints
export const MinMax: Story = {
  args: {
    modelValue: 5,
    label: 'Age',
    placeholder: 'Enter your age',
    min: 0,
    max: 120,
    validateOnInput: true
  },
  render: args => ({
    components: { NumberInput },
    setup() {
      const value = ref(args.modelValue)
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && value.value !== '') {
          notification.success(`Valid age: ${value.value}`, 'Success')
        }
      }

      return { args, value, handleValid }
    },
    template: `<NumberInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :min="args.min"
      :max="args.max"
      :validate-on-input="args.validateOnInput"
      @valid="handleValid"
    >
      <template #helper>
        Age must be between {{ args.min }} and {{ args.max }}
      </template>
    </NumberInput>
    <div class="mt-2">Current age: {{ value }}</div>`
  })
}

// Number input with step controls
export const StepControl: Story = {
  args: {
    modelValue: 10,
    label: 'Quantity',
    placeholder: 'Enter quantity',
    min: 0,
    step: 5
  },
  render: args => ({
    components: { NumberInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<NumberInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :min="args.min"
      :step="args.step"
    >
      <template #helper>
        Quantity increases in steps of {{ args.step }}
      </template>
    </NumberInput>
    <div class="mt-2">Current quantity: {{ value }}</div>`
  })
}

// Required number input
export const Required: Story = {
  args: {
    modelValue: '',
    label: 'Score',
    placeholder: 'Enter score (required)',
    required: true,
    min: 0,
    max: 100,
    validateOnInput: true
  },
  render: args => ({
    components: { NumberInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<NumberInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :required="args.required"
      :min="args.min"
      :max="args.max"
      :validate-on-input="args.validateOnInput"
    >
      <template #helper>
        Score must be between {{ args.min }} and {{ args.max }}
      </template>
    </NumberInput>
    <div class="mt-2">Current score: {{ value || 'Not set' }}</div>`
  })
}

// Disabled number input
export const Disabled: Story = {
  args: {
    modelValue: 42,
    label: 'Read-only Value',
    disabled: true
  },
  render: args => ({
    components: { NumberInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<NumberInput 
      v-model="value"
      :label="args.label"
      :disabled="args.disabled"
    >
      <template #helper>
        This value cannot be modified
      </template>
    </NumberInput>`
  })
}
