import type { Meta, StoryObj } from '@storybook/vue3'

import myButton from './button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: 'Primitive/Button',
  component: myButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof myButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Аргумент для содержимого слота
    default: 'Press me'
  },
  // Используем render функцию для отображения слота
  render: args => ({
    components: { myButton },
    setup() {
      // Добавляем обработчик клика с alert
      const onButtonClick = () => {
        alert('Button clicked!')
      }

      return { args, onButtonClick }
    },
    template: `<myButton v-bind="args" class="bg-red" @click="onButtonClick">{{ args.default }}</myButton>`
  })
}
