import type { Meta, StoryObj } from '@storybook/vue3'

import button from './button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Primitive/Button',
  component: button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Аргумент для содержимого слота
    default: 'Press me'
  },
  // Используем render функцию для отображения слота
  render: args => ({
    components: { button },
    setup() {
      // Добавляем обработчик клика с alert
      const onButtonClick = () => {
        alert('Button clicked!')
      }

      return { args, onButtonClick }
    },
    template: `<button v-bind="args" @click="onButtonClick">{{ args.default }}</button>`
  })
}
