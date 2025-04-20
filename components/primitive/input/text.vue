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
      <!-- Input field (text or textarea) -->
      <component
        :is="multiline ? 'textarea' : 'input'"
        :id="id"
        :type="hideText ? 'password' : 'text'"
        :value="inputValue"
        :placeholder="placeholder"
        :maxlength="maxLength || undefined"
        :pattern="pattern"
        :required="required"
        :disabled="disabled"
        :rows="multiline ? rows : undefined"
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

      <!-- Character counter if maxLength is provided -->
      <div
        v-if="maxLength && showCounter"
        class="absolute right-2 bottom-1 text-xs text-text-tertiary dark:text-dark-text-tertiary"
      >
        {{ inputValue.length }}/{{ maxLength }}
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

// Common validation patterns
const VALIDATION_PATTERNS = {
  // Basic email pattern
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Password with at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  STRONG_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  // Password with at least 8 characters
  BASIC_PASSWORD: /^.{8,}$/,
  // Numbers only
  NUMBERS_ONLY: /^\d+$/,
  // Letters only
  LETTERS_ONLY: /^[a-zA-Z]+$/,
  // URL pattern
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  // Phone number (basic international format)
  PHONE: /^\+?[1-9]\d{1,14}$/
}

// Validation type as string literal
type ValidationType =
  | 'email'
  | 'strongPassword'
  | 'basicPassword'
  | 'numbersOnly'
  | 'lettersOnly'
  | 'url'
  | 'phone'
  | 'custom'

const props = defineProps({
  modelValue: {
    type: String,
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
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`
  },
  // Either a RegExp object, a string pattern, or a predefined validation type
  validationType: {
    type: String as () => ValidationType,
    default: 'custom'
  },
  regex: {
    type: [RegExp, String],
    default: null,
    validator: (value: RegExp | string | null) => {
      if (value === null) return true

      if (typeof value === 'string') {
        try {
          new RegExp(value)
          return true
        } catch (e) {
          console.error('Invalid regex pattern provided:', e)
          return false
        }
      }

      if (value instanceof RegExp) return true

      return false
    }
  },
  hideText: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number,
    default: null,
    validator: (value: number | null) => {
      if (value === null) return true
      return value > 0
    }
  },
  showCounter: {
    type: Boolean,
    default: true
  },
  multiline: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3,
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
  },
  errorMessage: {
    type: String,
    default: 'The input does not match the required format'
  },
  customValidation: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'error', 'valid'])

// Local input value
const inputValue = ref(props.modelValue)
// Error message state
const error = ref('')
// Validation state
const isValid = ref(true)
// Notification composable
const notification = useNotification()
// Debounce timer
let validationTimer: ReturnType<typeof setTimeout> | null = null

// Get appropriate regex pattern based on validationType or custom regex
const regexPattern = computed(() => {
  // First priority: check for predefined validation type
  if (props.validationType && props.validationType !== 'custom') {
    switch (props.validationType) {
      case 'email':
        return VALIDATION_PATTERNS.EMAIL
      case 'strongPassword':
        return VALIDATION_PATTERNS.STRONG_PASSWORD
      case 'basicPassword':
        return VALIDATION_PATTERNS.BASIC_PASSWORD
      case 'numbersOnly':
        return VALIDATION_PATTERNS.NUMBERS_ONLY
      case 'lettersOnly':
        return VALIDATION_PATTERNS.LETTERS_ONLY
      case 'url':
        return VALIDATION_PATTERNS.URL
      case 'phone':
        return VALIDATION_PATTERNS.PHONE
      default:
        // For safety, should never reach here due to type constraints
        return null
    }
  }

  // Second priority: custom regex from props
  if (!props.regex) return null

  try {
    if (typeof props.regex === 'string') {
      return new RegExp(props.regex)
    }
    return props.regex
  } catch (e) {
    console.error('Error creating RegExp from provided pattern:', e)
    return null
  }
})

// Get default error message based on validation type
const defaultErrorMessage = computed(() => {
  if (props.validationType && props.validationType !== 'custom') {
    switch (props.validationType) {
      case 'email':
        return 'Please enter a valid email address'
      case 'strongPassword':
        return 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
      case 'basicPassword':
        return 'Password must be at least 8 characters'
      case 'numbersOnly':
        return 'Please enter numbers only'
      case 'lettersOnly':
        return 'Please enter letters only'
      case 'url':
        return 'Please enter a valid URL'
      case 'phone':
        return 'Please enter a valid phone number'
      default:
        return props.errorMessage
    }
  }
  return props.errorMessage
})

// Computed regex pattern for HTML5 validation
const pattern = computed(() => {
  if (!regexPattern.value) return undefined

  try {
    // Extract the pattern string from the RegExp object
    const patternStr = regexPattern.value.toString()
    // Remove the leading / and trailing /flags
    return patternStr.substring(1, patternStr.lastIndexOf('/'))
  } catch (e) {
    console.error('Error extracting pattern string:', e)
    return undefined
  }
})

// Handle direct DOM input event
const onInputChange = (event: Event) => {
  if (props.disabled) return

  // Get the value from the target element
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const newValue = target.value

  // Update local state
  inputValue.value = newValue

  // Emit update to parent component immediately
  emit('update:modelValue', newValue)

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

// Validate the input based on the validation rules
const validateInput = () => {
  if (props.disabled) return

  // Reset error state
  error.value = ''
  isValid.value = true

  // Make sure we're working with the most current value (trim to handle whitespace)
  const currentValue = inputValue.value.trim()

  // First validate required state - only if the field is actually empty
  if (props.required && currentValue.length === 0) {
    error.value = 'This field is required'
    isValid.value = false
    emit('error', error.value)

    if (props.showNotificationOnError) {
      notification.warning(error.value, 'Validation Error')
    }
    return
  }

  // Skip further validation for empty non-required fields
  if (currentValue.length === 0 && !props.required) {
    isValid.value = true
    emit('valid', true)
    return
  }

  // At this point we know the field has content, so proceed with validation

  // Apply custom validation if provided
  if (props.customValidation) {
    try {
      const customResult = props.customValidation(currentValue)
      if (typeof customResult === 'string') {
        // If string is returned, it's an error message
        error.value = customResult
        isValid.value = false
        emit('error', error.value)

        if (props.showNotificationOnError) {
          notification.warning(error.value, 'Validation Error')
        }
        return
      } else if (customResult === false) {
        // If false is returned, use default error message
        error.value = defaultErrorMessage.value
        isValid.value = false
        emit('error', error.value)

        if (props.showNotificationOnError) {
          notification.warning(error.value, 'Validation Error')
        }
        return
      }
      // If true or nothing is returned, validation passed
    } catch (e) {
      console.error('Error in custom validation function:', e)
    }
  }

  // Apply regex validation if provided
  if (regexPattern.value) {
    try {
      if (!regexPattern.value.test(currentValue)) {
        error.value = defaultErrorMessage.value
        isValid.value = false
        emit('error', error.value)

        if (props.showNotificationOnError) {
          notification.warning(error.value, 'Validation Error')
        }
        return
      }
    } catch (e) {
      console.error('Error during regex validation:', e)
      error.value = 'Validation error occurred'
      isValid.value = false
      emit('error', error.value)
      return
    }
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
    if (newVal !== inputValue.value) {
      inputValue.value = newVal

      // Validate on external value change if not empty
      if (
        newVal &&
        (regexPattern.value || props.required || props.customValidation)
      ) {
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
  if (
    inputValue.value &&
    (regexPattern.value || props.required || props.customValidation)
  ) {
    validateInput()
  }
})
</script>
