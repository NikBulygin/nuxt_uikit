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
        :step="step"
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
      `input-number-${Math.random().toString(36).substring(2, 9)}`
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  step: {
    type: Number,
    default: 1
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

// Handle direct DOM input event
const onInputChange = (event: Event) => {
  if (props.disabled) return

  // Get the value from the target element
  const target = event.target as HTMLInputElement
  const newValue = target.value

  // Update local state
  inputValue.value = newValue

  // Emit update to parent component immediately
  emit('update:modelValue', newValue === '' ? '' : Number(newValue))

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

    // Set timeout for delayed validation (1.5 seconds after user stops typing)
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
