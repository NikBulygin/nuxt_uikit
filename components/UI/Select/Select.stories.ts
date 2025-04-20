import type { Meta, StoryObj } from '@storybook/vue3'
import Select from './Select.vue'
import type { SelectItem } from '~/types/general/select'

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Enable multiple selection'
    },
    withSearch: {
      control: 'boolean',
      description: 'Enable search functionality'
    },
    items: {
      control: 'object',
      description: 'Array of items to select from'
    },
    modelValue: {
      control: 'object',
      description: 'Selected value(s)'
    }
  }
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const sampleItems: SelectItem[] = [
  {
    text: 'Option 1',
    prefix_image: '/icons/option1-prefix.svg',
    post_image: '/icons/option1-post.svg'
  },
  {
    text: 'Option 2',
    prefix_image: '/icons/option2-prefix.svg'
  },
  {
    text: 'Option 3',
    post_image: '/icons/option3-post.svg'
  },
  {
    text: 'Option 4'
  }
]

export const Single: Story = {
  args: {
    items: sampleItems,
    multiple: false,
    withSearch: false,
    modelValue: { text: '' } as SelectItem
  }
}

export const Multiple: Story = {
  args: {
    items: sampleItems,
    multiple: true,
    withSearch: false,
    modelValue: []
  }
}

export const WithSearch: Story = {
  args: {
    items: sampleItems,
    multiple: false,
    withSearch: true,
    modelValue: { text: '' } as SelectItem
  }
}

export const MultipleWithSearch: Story = {
  args: {
    items: sampleItems,
    multiple: true,
    withSearch: true,
    modelValue: []
  }
}
