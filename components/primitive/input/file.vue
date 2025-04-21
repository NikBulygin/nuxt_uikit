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

    <!-- File Input Area -->
    <div
      class="relative border-2 border-dashed rounded-md p-4 text-center transition-colors"
      :class="[
        error
          ? 'border-danger bg-danger/5 text-danger'
          : isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border dark:border-dark-border hover:border-primary hover:bg-primary/5',
        disabled
          ? 'opacity-70 cursor-not-allowed bg-gray-100'
          : 'cursor-pointer'
      ]"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onFileDrop"
      @click="!disabled && ($refs.fileInput as HTMLInputElement).click()"
    >
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        :id="id"
        type="file"
        class="hidden"
        :accept="acceptedFileTypes"
        :multiple="multiple"
        :disabled="disabled"
        @change="onFileSelect"
      />

      <!-- Upload icon -->
      <div v-if="!files.length" class="py-4">
        <div
          class="text-4xl mb-2 text-text-tertiary dark:text-dark-text-tertiary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-12 h-12 mx-auto"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p class="text-text-secondary dark:text-dark-text-secondary mb-1">
          {{
            isDragging
              ? t('fileInput.dragActive')
              : t('fileInput.dragAndDrop')
          }}
        </p>
        <p
          v-if="acceptedFileTypes"
          class="text-xs text-text-tertiary dark:text-dark-text-tertiary"
        >
          {{ t('fileInput.acceptedTypes', { types: formatAcceptedTypes }) }}
        </p>
        <p
          v-if="maxSize"
          class="text-xs text-text-tertiary dark:text-dark-text-tertiary"
        >
          {{ t('fileInput.maxSize', { size: formatFileSize(maxSize) }) }}
        </p>
      </div>

      <!-- Selected files list -->
      <div v-else class="py-2">
        <ul class="divide-y divide-border dark:divide-dark-border">
          <li
            v-for="(file, index) in files"
            :key="index"
            class="flex items-center justify-between py-2 text-left"
          >
            <div class="flex items-center space-x-2">
              <!-- File type icon based on mime type -->
              <span
                class="text-text-tertiary dark:text-dark-text-tertiary"
              >
                <svg
                  v-if="isImageFile(file)"
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <svg
                  v-else-if="isPdfFile(file)"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <svg
                  v-else
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <div>
                <p
                  class="text-sm font-medium text-text-primary dark:text-dark-text-primary truncate max-w-xs"
                >
                  {{ file.name }}
                </p>
                <p
                  class="text-xs text-text-tertiary dark:text-dark-text-tertiary"
                >
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>
            <button
              v-if="!disabled"
              @click.stop="removeFile(index)"
              class="text-text-tertiary hover:text-danger p-1 rounded-full"
              :aria-label="t('fileInput.aria.removeFile')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        </ul>
        <div v-if="!disabled" class="mt-2 text-center">
          <button
            @click.stop="clearFiles"
            class="text-sm text-danger hover:underline mr-2"
          >
            {{ t('fileInput.actions.clearAll') }}
          </button>
          <button
            @click.stop=";(fileInput as HTMLInputElement).click()"
            class="text-sm text-primary hover:underline"
          >
            {{ multiple ? t('fileInput.actions.addMore') : t('fileInput.actions.changeFile') }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { useNotification } from '~/composables/useNotification'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () =>
      `input-file-${Math.random().toString(36).substring(2, 9)}`
  },
  acceptedFileTypes: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: null // in bytes
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
  showNotificationOnError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'error', 'valid'])

// Local state
const files = ref<File[]>([])
const error = ref('')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Notification service
const notification = useNotification()

// Add i18n
const { t } = useI18n()

// Format accepted file types for display
const formatAcceptedTypes = computed(() => {
  if (!props.acceptedFileTypes) return ''

  return props.acceptedFileTypes
    .split(',')
    .map(type => type.trim())
    .map(type => {
      if (type.startsWith('.')) return type
      if (type.includes('/')) {
        const [category, subtype] = type.split('/')
        if (subtype === '*') return `${category} files`
        return `${subtype} files`
      }
      return type
    })
    .join(', ')
})

// Format file size for display
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Determine if file is an image
const isImageFile = (file: File) => {
  return file.type.startsWith('image/')
}

// Determine if file is a PDF
const isPdfFile = (file: File) => {
  return file.type === 'application/pdf'
}

// Handle drag over event
const onDragOver = () => {
  if (props.disabled) return
  isDragging.value = true
}

// Handle drag leave event
const onDragLeave = () => {
  isDragging.value = false
}

// Handle file drop event
const onFileDrop = (event: DragEvent) => {
  if (props.disabled) return
  isDragging.value = false

  const droppedFiles = event.dataTransfer?.files
  if (!droppedFiles) return

  handleFiles(droppedFiles)
}

// Handle file selection from input
const onFileSelect = (event: Event) => {
  if (props.disabled) return

  const input = event.target as HTMLInputElement
  const selectedFiles = input.files

  if (!selectedFiles) return

  handleFiles(selectedFiles)

  // Reset input so change event fires even if same file is selected
  input.value = ''
}

// Process files from either drop or select
const handleFiles = (fileList: FileList) => {
  // Reset error
  error.value = ''

  // Convert FileList to array for processing
  const newFiles: File[] = []

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]

    // Skip if we're not allowing multiple files and we already have one
    if (!props.multiple && files.value.length > 0) {
      if (props.showNotificationOnError) {
        notification.warning(
          t('fileInput.validation.required'),
          'Validation Error'
        )
      }
      break
    }

    // Validate file type if acceptedFileTypes is specified
    if (props.acceptedFileTypes && !isValidFileType(file)) {
      error.value = t('fileInput.validation.fileType', { filename: file.name })
      emit('error', error.value)

      if (props.showNotificationOnError) {
        notification.warning(error.value, 'Validation Error')
      }
      continue
    }

    // Validate file size if maxSize is specified
    if (props.maxSize && file.size > props.maxSize) {
      error.value = t('fileInput.validation.fileSize', {
        filename: file.name,
        size: formatFileSize(file.size)
      })
      emit('error', error.value)

      if (props.showNotificationOnError) {
        notification.warning(error.value, 'Validation Error')
      }
      continue
    }

    // Add file to our list
    newFiles.push(file)
  }

  // Update files array based on multiple setting
  if (props.multiple) {
    files.value = [...files.value, ...newFiles]
  } else if (newFiles.length > 0) {
    files.value = [newFiles[0]]
  }

  // Emit updated file list
  emit('update:modelValue', files.value)

  // Emit validation state
  validateFiles()
}

// Validate file extensions and mime types
const isValidFileType = (file: File) => {
  if (!props.acceptedFileTypes) return true

  const fileType = file.type
  const fileName = file.name
  const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase()

  const acceptedTypes = props.acceptedFileTypes
    .split(',')
    .map(type => type.trim())

  return acceptedTypes.some(type => {
    // Check for file extension (e.g., .jpg, .pdf)
    if (type.startsWith('.')) {
      return fileExtension === type.toLowerCase()
    }

    // Check for exact mime type match (e.g., image/jpeg)
    if (!type.includes('*')) {
      return fileType === type
    }

    // Check for wildcard mime type (e.g., image/*)
    if (type.endsWith('/*')) {
      const category = type.split('/')[0]
      return fileType.startsWith(category + '/')
    }

    return false
  })
}

// Remove a file from the list
const removeFile = (index: number) => {
  files.value = files.value.filter((_, i) => i !== index)
  emit('update:modelValue', files.value)
  validateFiles()
}

// Clear all files
const clearFiles = () => {
  files.value = []
  emit('update:modelValue', files.value)
  validateFiles()
}

// Validate if files meet requirements
const validateFiles = () => {
  error.value = ''
  isValid.value = false

  // Check required field
  if (props.required && files.value.length === 0) {
    error.value = t('fileInput.validation.required')
    emit('error', error.value)
    return
  }

  // If we got here, validation passed
  emit('valid', true)
}

// Watch for model value changes from parent
watch(
  () => props.modelValue,
  newVal => {
    if (Array.isArray(newVal) && newVal !== files.value) {
      files.value = newVal as File[]
      validateFiles()
    }
  },
  { immediate: true }
)

// Initial validation on mount
onMounted(() => {
  validateFiles()
})
</script>
