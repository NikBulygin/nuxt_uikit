import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import TextInput from './text.vue'
import { useNotification } from '../../../composables/useNotification'

const meta = {
  title: 'Primitive/Input/Text',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
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
    validationType: {
      control: 'select',
      options: [
        'custom',
        'email',
        'strongPassword',
        'basicPassword',
        'numbersOnly',
        'lettersOnly',
        'url',
        'phone'
      ],
      description: 'Predefined validation type'
    },
    regex: {
      control: 'object',
      description: 'Regular expression for custom validation'
    },
    hideText: {
      control: 'boolean',
      description: 'Hide text (password mode)'
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length'
    },
    showCounter: {
      control: 'boolean',
      description: 'Show character counter'
    },
    multiline: {
      control: 'boolean',
      description: 'Enable multiline input (textarea)'
    },
    rows: {
      control: 'number',
      description: 'Number of rows for textarea'
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
    },
    errorMessage: {
      control: 'text',
      description: 'Custom error message'
    }
  }
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

// Basic text input with helper slot
export const Default: Story = {
  args: {
    modelValue: '',
    label: 'Name',
    placeholder: 'Enter your name'
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
    >
      <template #helper>
        Please enter your full name
      </template>
    </TextInput>`
  })
}

// Password input with validation - using helper text prop
export const Password: Story = {
  args: {
    modelValue: '',
    label: 'Password',
    placeholder: 'Enter your password',
    hideText: true,
    validationType: 'strongPassword',
    validateOnInput: true,
    helperText:
      'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && value.value) {
          notification.success(
            'Password meets complexity requirements!',
            'Success'
          )
        }
      }

      return { args, value, handleValid }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :hide-text="args.hideText"
      :validation-type="args.validationType"
      :validate-on-input="args.validateOnInput"
      :helper-text="args.helperText"
      @valid="handleValid"
    />`
  })
}

// Email validation with rich helper text content
export const Email: Story = {
  args: {
    modelValue: '',
    label: 'Email',
    placeholder: 'Enter your email',
    validationType: 'email',
    required: true,
    validateOnInput: true
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && value.value) {
          notification.success('Valid email address!', 'Success')
        }
      }

      return { args, value, handleValid }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :validation-type="args.validationType"
      :required="args.required"
      :validate-on-input="args.validateOnInput"
      @valid="handleValid"
    >
      <template #helper>
        <span>We'll never share your email. <span class="text-primary">Privacy Policy</span></span>
      </template>
    </TextInput>`
  })
}

// Multiline text input
export const Multiline: Story = {
  args: {
    modelValue: '',
    label: 'Message',
    placeholder: 'Enter your message',
    multiline: true,
    rows: 4,
    maxLength: 500,
    showCounter: true
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :multiline="args.multiline"
      :rows="args.rows"
      :max-length="args.maxLength"
      :show-counter="args.showCounter"
    >
      <template #helper>
        Please be concise with your message
      </template>
    </TextInput>`
  })
}

// Phone Number with validation
export const PhoneNumber: Story = {
  args: {
    modelValue: '',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    validationType: 'phone',
    required: true,
    validateOnInput: true,
    helperText: 'Include country code (e.g., +1 for US)'
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :validation-type="args.validationType"
      :required="args.required"
      :validate-on-input="args.validateOnInput"
      :helper-text="args.helperText"
    />`
  })
}

// Numbers Only input
export const NumbersOnly: Story = {
  args: {
    modelValue: '',
    label: 'Age',
    placeholder: 'Enter your age',
    validationType: 'numbersOnly',
    validateOnInput: true,
    helperText: 'Please enter a number'
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :validation-type="args.validationType"
      :validate-on-input="args.validateOnInput"
      :helper-text="args.helperText"
    />`
  })
}

// URL input
export const UrlInput: Story = {
  args: {
    modelValue: '',
    label: 'Website',
    placeholder: 'Enter your website URL',
    validationType: 'url',
    validateOnInput: true,
    helperText: 'Please enter a valid URL (e.g., https://example.com)'
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :placeholder="args.placeholder"
      :validation-type="args.validationType"
      :validate-on-input="args.validateOnInput"
      :helper-text="args.helperText"
    />`
  })
}

// Disabled input
export const Disabled: Story = {
  args: {
    modelValue: 'Disabled content',
    label: 'Disabled Input',
    disabled: true,
    helperText: 'This input cannot be edited'
  },
  render: args => ({
    components: { TextInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `<TextInput 
      v-model="value"
      :label="args.label"
      :disabled="args.disabled"
      :helper-text="args.helperText"
    />`
  })
}
