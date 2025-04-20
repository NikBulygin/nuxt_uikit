<template>
  <div class="w-full">
    <!-- Label if provided -->
    <label
      v-if="label"
      :for="id"
      class="block mb-1 text-sm font-medium text-text-primary dark:text-dark-text-primary"
    >
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <!-- Input container -->
    <div class="relative">
      <!-- Input field -->
      <input
        :id="id"
        type="number"
        :value="inputValue"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :step="getStepValue"
        :required="required"
        :disabled="disabled"
        class="w-full px-3 py-2 bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary border rounded-md focus:outline-none focus:ring-2"
        :class="[
          error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-border dark:border-dark-border focus:border-primary focus:ring-primary/20',
          disabled
            ? 'bg-gray-100 dark:bg-dark-surface cursor-not-allowed opacity-70'
            : ''
        ]"
        @input="onInputChange($event)"
        @blur="validateOnBlur"
      />

      <!-- Display formatted value -->
      <div
        v-if="displayMode !== 'full' && formattedValue && !error"
        class="mt-1 text-xs text-text-tertiary dark:text-dark-text-tertiary font-mono"
      >
        {{ formattedValue }}
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useNotification } from '~/composables/useNotification'

// Display mode type
type DisplayMode = 'full' | 'first' | 'last' | 'firstLast' | 'scientific'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () =>
      `input-float-${Math.random().toString(36).substring(2, 9)}`
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  precision: {
    type: Number,
    default: 2,
    validator: (value: number) => value >= 0
  },
  displayMode: {
    type: String as () => DisplayMode,
    default: 'full',
    validator: (value: string) =>
      ['full', 'first', 'last', 'firstLast', 'scientific'].includes(value)
  },
  displayDigits: {
    type: Number,
    default: 5,
    validator: (value: number) => value > 0
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  helperText: {
    type: String,
    default: ''
  },
  validateOnInput: {
    type: Boolean,
    default: false
  },
  validationDelay: {
    type: Number,
    default: 1500, // 1.5 seconds delay
    validator: (value: number) => value >= 0
  },
  showNotificationOnError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'error', 'valid'])

// Local input value
const inputValue = ref(
  props.modelValue === null ? '' : String(props.modelValue)
)
// Error message state
const error = ref('')
// Validation state
const isValid = ref(true)
// Notification composable
const notification = useNotification()
// Debounce timer
let validationTimer: ReturnType<typeof setTimeout> | null = null

// Compute step value based on precision
const getStepValue = computed(() => {
  return Math.pow(10, -props.precision)
})

// Format the displayed value based on the display mode
const formattedValue = computed(() => {
  if (inputValue.value === '') return ''

  try {
    const numberValue = Number(inputValue.value)
    if (isNaN(numberValue)) return ''

    // Handle scientific notation
    if (props.displayMode === 'scientific') {
      return numberValue.toExponential(props.precision)
    }

    // Format to required precision
    const formatted = numberValue.toFixed(props.precision)

    // Return full value if display mode is full
    if (props.displayMode === 'full') {
      return formatted
    }

    // Handle first N digits
    if (props.displayMode === 'first') {
      return formatted.slice(0, props.displayDigits) + '...'
    }

    // Handle last N digits
    if (props.displayMode === 'last') {
      return '...' + formatted.slice(-props.displayDigits)
    }

    // Handle first and last N digits
    if (props.displayMode === 'firstLast') {
      const halfDigits = Math.floor(props.displayDigits / 2)
      return (
        formatted.slice(0, halfDigits) +
        '...' +
        formatted.slice(-halfDigits)
      )
    }

    return formatted
  } catch (e) {
    console.error('Error formatting float value:', e)
    return ''
  }
})

// Handle direct DOM input event
const onInputChange = (event: Event) => {
  if (props.disabled) return

  // Get the value from the target element
  const target = event.target as HTMLInputElement
  const newValue = target.value

  // Update local state
  inputValue.value = newValue

  // Emit update to parent component immediately - maintain precision in the number value
  if (newValue === '') {
    emit('update:modelValue', '')
  } else {
    const numValue = Number(newValue)
    if (!isNaN(numValue)) {
      // Use parseFloat with toFixed to maintain correct precision
      emit(
        'update:modelValue',
        parseFloat(numValue.toFixed(props.precision))
      )
    } else {
      emit('update:modelValue', newValue)
    }
  }

  // Handle validation with debounce if necessary
  if (props.validateOnInput) {
    // Clear any previous timeout
    if (validationTimer) {
      clearTimeout(validationTimer)
    }

    // Reset error state while typing
    if (error.value) {
      error.value = ''
    }

    // Set timeout for delayed validation
    validationTimer = setTimeout(() => {
      validateInput()
    }, props.validationDelay)
  }
}

// Validate the input
const validateInput = () => {
  if (props.disabled) return

  // Reset error state
  error.value = ''
  isValid.value = true

  // Skip validation for empty non-required fields
  if (inputValue.value === '' && !props.required) {
    isValid.value = true
    emit('valid', true)
    return
  }

  // Check required field
  if (props.required && inputValue.value === '') {
    error.value = 'This field is required'
    isValid.value = false
    emit('error', error.value)

    if (props.showNotificationOnError) {
      notification.warning(error.value, 'Validation Error')
    }
    return
  }

  // Validate number
  const numValue = Number(inputValue.value)

  // Check if valid number
  if (isNaN(numValue)) {
    error.value = 'Please enter a valid number'
    isValid.value = false
    emit('error', error.value)

    if (props.showNotificationOnError) {
      notification.warning(error.value, 'Validation Error')
    }
    return
  }

  // Check min value
  if (props.min !== null && numValue < props.min) {
    error.value = `Value must be at least ${props.min}`
    isValid.value = false
    emit('error', error.value)

    if (props.showNotificationOnError) {
      notification.warning(error.value, 'Validation Error')
    }
    return
  }

  // Check max value
  if (props.max !== null && numValue > props.max) {
    error.value = `Value must be at most ${props.max}`
    isValid.value = false
    emit('error', error.value)

    if (props.showNotificationOnError) {
      notification.warning(error.value, 'Validation Error')
    }
    return
  }

  // If we got this far, validation passed
  isValid.value = true
  emit('valid', true)
}

// Perform validation on blur
const validateOnBlur = () => {
  if (props.disabled) return

  // Clear any pending validation
  if (validationTimer) {
    clearTimeout(validationTimer)
    validationTimer = null
  }

  // Always validate on blur for better UX
  validateInput()

  // Format the value to the correct precision on blur
  if (inputValue.value !== '' && !isNaN(Number(inputValue.value))) {
    const numValue = Number(inputValue.value)
    const formatted = numValue.toFixed(props.precision)
    inputValue.value = formatted
    emit('update:modelValue', parseFloat(formatted))
  }
}

// Watch for model value changes from parent
watch(
  () => props.modelValue,
  newVal => {
    // Convert to string for the input field
    const newValStr =
      newVal === null || newVal === '' ? '' : String(newVal)

    if (newValStr !== inputValue.value) {
      inputValue.value = newValStr

      // Validate on external value change if not empty
      if (newValStr && props.validateOnInput) {
        // Use a small delay to allow the UI to update first
        setTimeout(() => validateInput(), 0)
      }
    }
  },
  { immediate: true } // This ensures it runs on component initialization
)

// Watch for precision changes
watch(
  () => props.precision,
  () => {
    // Update the value format when precision changes
    if (inputValue.value !== '' && !isNaN(Number(inputValue.value))) {
      const numValue = Number(inputValue.value)
      const formatted = numValue.toFixed(props.precision)
      inputValue.value = formatted
      emit('update:modelValue', parseFloat(formatted))
    }
  }
)

// Clean up any pending validation timer when component is destroyed
onBeforeUnmount(() => {
  if (validationTimer) {
    clearTimeout(validationTimer)
    validationTimer = null
  }
})

// Validate on mount if there's an initial value
onMounted(() => {
  if (inputValue.value) {
    validateInput()
  }
})
</script>
