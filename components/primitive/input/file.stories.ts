import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FileInput from './file.vue'
import { useNotification } from '../../../composables/useNotification'

const meta = {
  title: 'Primitive/Input/File',
  component: FileInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'object',
      description: 'Array of files'
    },
    label: {
      control: 'text',
      description: 'Input label'
    },
    acceptedFileTypes: {
      control: 'text',
      description:
        'Comma-separated list of accepted MIME types or file extensions'
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection'
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes'
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
      description: 'Validate on file selection'
    },
    showNotificationOnError: {
      control: 'boolean',
      description: 'Show notification on validation error'
    }
  }
} satisfies Meta<typeof FileInput>

export default meta
type Story = StoryObj<typeof meta>

// Basic file upload
export const Default: Story = {
  args: {
    modelValue: [],
    label: 'Upload File'
  },
  render: args => ({
    components: { FileInput },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: `<FileInput 
      v-model="files"
      :label="args.label"
    >
      <template #helper>
        Select a file to upload
      </template>
    </FileInput>
    <div class="mt-2" v-if="files.length">
      Selected {{ files.length }} file(s)
    </div>`
  })
}

// Image upload with preview
export const ImageUpload: Story = {
  args: {
    modelValue: [],
    label: 'Upload Image',
    acceptedFileTypes: 'image/*',
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  render: args => ({
    components: { FileInput },
    setup() {
      const files = ref([])
      const imagePreview = ref('')

      const updatePreview = () => {
        if (files.value.length > 0) {
          const file = files.value[0]
          const reader = new FileReader()
          reader.onload = e => {
            imagePreview.value = e.target?.result as string
          }
          reader.readAsDataURL(file)
        } else {
          imagePreview.value = ''
        }
      }

      watch(
        () => files.value,
        () => updatePreview(),
        { immediate: true }
      )

      return { args, files, imagePreview }
    },
    template: `<div>
      <FileInput 
        v-model="files"
        :label="args.label"
        :accepted-file-types="args.acceptedFileTypes"
        :max-size="args.maxSize"
      >
        <template #helper>
          Select an image file (max 5MB)
        </template>
      </FileInput>
      
      <div v-if="imagePreview" class="mt-4">
        <p class="text-sm font-medium mb-2">Image Preview:</p>
        <img :src="imagePreview" class="max-w-full max-h-64 rounded-md" />
      </div>
    </div>`
  })
}

// Multiple file upload
export const MultipleFiles: Story = {
  args: {
    modelValue: [],
    label: 'Upload Documents',
    acceptedFileTypes: '.pdf,.doc,.docx',
    multiple: true,
    required: true,
    validateOnInput: true
  },
  render: args => ({
    components: { FileInput },
    setup() {
      const files = ref([])
      const notification = useNotification()

      const handleValid = (isValid: boolean) => {
        if (isValid && files.value.length > 0) {
          notification.success(
            `${files.value.length} files ready to upload`,
            'Files Valid'
          )
        }
      }

      return { args, files, handleValid }
    },
    template: `<FileInput 
      v-model="files"
      :label="args.label"
      :accepted-file-types="args.acceptedFileTypes"
      :multiple="args.multiple"
      :required="args.required"
      :validate-on-input="args.validateOnInput"
      @valid="handleValid"
    >
      <template #helper>
        Upload one or more document files (PDF, DOC, DOCX)
      </template>
    </FileInput>
    <div class="mt-2" v-if="files.length">
      Selected {{ files.length }} document(s)
    </div>`
  })
}

// Disabled file input
export const Disabled: Story = {
  args: {
    modelValue: [],
    label: 'Upload File',
    disabled: true
  },
  render: args => ({
    components: { FileInput },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: `<FileInput 
      v-model="files"
      :label="args.label"
      :disabled="args.disabled"
    >
      <template #helper>
        File uploads are currently disabled
      </template>
    </FileInput>`
  })
}

// File size validation
export const FileSizeValidation: Story = {
  args: {
    modelValue: [],
    label: 'Upload Small File',
    maxSize: 100 * 1024, // 100KB
    showNotificationOnError: true
  },
  render: args => ({
    components: { FileInput },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: `<FileInput 
      v-model="files"
      :label="args.label"
      :max-size="args.maxSize"
      :show-notification-on-error="args.showNotificationOnError"
    >
      <template #helper>
        Maximum file size: 100KB
      </template>
    </FileInput>`
  })
}
