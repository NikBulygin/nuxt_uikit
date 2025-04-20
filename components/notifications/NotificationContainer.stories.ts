import type { Meta, StoryObj } from '@storybook/vue3'
import { useNotification } from '~/composables/useNotification'
import NotificationContainer from './NotificationContainer.vue'

const meta = {
  title: 'Components/NotificationContainer',
  component: NotificationContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Контейнер для отображения уведомлений в правом нижнем углу экрана'
      }
    }
  }
} satisfies Meta<typeof NotificationContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NotificationContainer },
    setup() {
      const notification = useNotification()
      // Очищаем предыдущие уведомления
      notification.notifications.splice(
        0,
        notification.notifications.length
      )
      // Добавляем тестовые уведомления
      notification.info('Это информационное сообщение', 'Информация')
      notification.success('Операция успешно выполнена', 'Успех')
      notification.warning(
        'Обратите внимание на предупреждение',
        'Предупреждение'
      )
      notification.danger(
        'Произошла ошибка при выполнении операции',
        'Ошибка'
      )

      return {}
    },
    template: `<NotificationContainer />`
  })
}

export const WithDifferentTimers: Story = {
  render: () => ({
    components: { NotificationContainer },
    setup() {
      const notification = useNotification()
      // Очищаем предыдущие уведомления
      notification.notifications.splice(
        0,
        notification.notifications.length
      )
      // Добавляем тестовые уведомления с разными таймерами
      notification.info('Исчезнет через 3 секунды', 'Короткое', 3000)
      notification.success('Исчезнет через 6 секунд', 'Среднее', 6000)
      notification.warning('Исчезнет через 9 секунд', 'Длинное', 9000)
      notification.danger('Не исчезнет автоматически', 'Бесконечное', 0)

      return {}
    },
    template: `<NotificationContainer />`
  })
}
