import type { Meta, StoryObj } from '@storybook/vue3'
import Table from './index.vue'

const meta = {
  title: 'Container/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    modelValue: [
      { a: 1.5, b: 2.5, c: 'Group 1', d: 4, e: 8 },
      { a: 2.5, b: 3.5, c: 'Group 1', d: 6, e: 8 },
      { a: 1.0, b: 1.0, c: 'Group 2', d: 2, e: 2 }
    ],
    columns: [
      { key: 'a', label: 'A', type: 'float', editable: true },
      { key: 'b', label: 'B', type: 'float', editable: true },
      { key: 'c', label: 'C', type: 'text', editable: true },
      { key: 'd', label: 'D (A+B)', type: 'float', computed: true },
      { key: 'e', label: 'E (Sum of D in group)', type: 'float', computed: true }
    ]
  }
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => ({
    components: { Table },
    setup() {
      return { args }
    },
    template: '<Table v-bind="args" />'
  })
}
