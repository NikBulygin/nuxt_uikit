import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './index.vue'

const meta = {
  title: 'Primitive/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Название иконки'
    }
  }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    name: 'info'
  },
  render: args => ({
    components: { Icon },
    setup() {
      return { args }
    },
    template: `<div class="w-10 h-10 text-blue-500"><Icon v-bind="args" /></div>`
  })
}

export const Success: Story = {
  args: {
    name: 'success'
  },
  render: args => ({
    components: { Icon },
    setup() {
      return { args }
    },
    template: `<div class="w-10 h-10 text-green-500"><Icon v-bind="args" /></div>`
  })
}

export const Warning: Story = {
  args: {
    name: 'warning'
  },
  render: args => ({
    components: { Icon },
    setup() {
      return { args }
    },
    template: `<div class="w-10 h-10 text-yellow-500"><Icon v-bind="args" /></div>`
  })
}

export const Danger: Story = {
  args: {
    name: 'danger'
  },
  render: args => ({
    components: { Icon },
    setup() {
      return { args }
    },
    template: `<div class="w-10 h-10 text-red-500"><Icon v-bind="args" /></div>`
  })
}
