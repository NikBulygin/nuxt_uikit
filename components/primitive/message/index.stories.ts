import type { Meta, StoryObj } from '@storybook/vue3'
import Message from './index.vue'

const meta = {
  title: 'Primitive/Message',
  component: Message,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Тип сообщения'
    },
    message: {
      control: 'text',
      description: 'Текст сообщения'
    },
    title: {
      control: 'text',
      description: 'Заголовок сообщения (опционально)'
    },
    timer: {
      control: 'number',
      description:
        'Время показа сообщения в миллисекундах (0 - бесконечно)'
    }
  }
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Это информационное сообщение',
    title: 'Информация',
    timer: 0
  },
  render: args => ({
    components: { Message },
    setup() {
      const onClose = () => {
        console.log('Message closed!')
      }
      return { args, onClose }
    },
    template: `<Message v-bind="args" @close="onClose" />`
  })
}

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Операция успешно завершена',
    title: 'Успех',
    timer: 0
  },
  render: args => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `<Message v-bind="args" />`
  })
}

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Обратите внимание на предупреждение',
    title: 'Предупреждение',
    timer: 0
  },
  render: args => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `<Message v-bind="args" />`
  })
}

export const Danger: Story = {
  args: {
    type: 'danger',
    message: 'Произошла ошибка при выполнении операции',
    title: 'Ошибка',
    timer: 0
  },
  render: args => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `<Message v-bind="args" />`
  })
}

export const WithTimer: Story = {
  args: {
    type: 'info',
    message: 'Это сообщение исчезнет через 5 секунд',
    title: 'С таймером',
    timer: 5000
  },
  render: args => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `<Message v-bind="args" />`
  })
}

export const WithoutTitle: Story = {
  args: {
    type: 'info',
    message: 'Сообщение без заголовка',
    title: '',
    timer: 0
  },
  render: args => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `<Message v-bind="args" />`
  })
}
