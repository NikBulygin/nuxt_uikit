import { ref, reactive } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'danger'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  title?: string
  timer?: number
}

const notifications = reactive<Notification[]>([])
let counter = 0

export const useNotification = () => {
  const add = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${counter++}`
    const newNotification = { ...notification, id }
    notifications.push(newNotification)
    return id
  }

  const remove = (id?: string) => {
    if (!id) return

    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
    }
  }

  const info = (message: string, title?: string, timer?: number) => {
    return add({ type: 'info', message, title, timer })
  }

  const success = (message: string, title?: string, timer?: number) => {
    return add({ type: 'success', message, title, timer })
  }

  const warning = (message: string, title?: string, timer?: number) => {
    return add({ type: 'warning', message, title, timer })
  }

  const danger = (message: string, title?: string, timer?: number) => {
    return add({ type: 'danger', message, title, timer })
  }

  return {
    notifications,
    add,
    remove,
    info,
    success,
    warning,
    danger
  }
}
