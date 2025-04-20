import type { Meta, StoryObj } from '@storybook/vue3'
import NotificationExample from './NotificationExample.vue'

const meta = {
  title: 'Examples/Notifications',
  component: NotificationExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Пример использования системы уведомлений'
      }
    }
  }
} satisfies Meta<typeof NotificationExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NotificationExample },
    template: `<NotificationExample />`
  })
}
