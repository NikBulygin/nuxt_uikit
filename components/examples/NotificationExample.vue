<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-semibold">Примеры уведомлений</h2>
    <div class="flex flex-wrap gap-4">
      <Button @click="showInfoNotification">Информация</Button>
      <Button @click="showSuccessNotification">Успех</Button>
      <Button @click="showWarningNotification">Предупреждение</Button>
      <Button @click="showDangerNotification">Ошибка</Button>
      <Button @click="showWithoutTitle">Без заголовка</Button>
      <Button @click="showLongTimer">Долгий таймер (10с)</Button>
      <Button @click="showNoTimer">Без таймера</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
import Button from '~/components/primitive/button/button.vue'

const notification = useNotification()

const showInfoNotification = () => {
  notification.info(
    'Это информационное сообщение для пользователя',
    'Информация'
  )
}

const showSuccessNotification = () => {
  notification.success('Операция успешно выполнена', 'Успех')
}

const showWarningNotification = () => {
  notification.warning(
    'Обратите внимание на предупреждение',
    'Предупреждение'
  )
}

const showDangerNotification = () => {
  notification.danger('Произошла ошибка при выполнении операции', 'Ошибка')
}

const showWithoutTitle = () => {
  notification.info('Уведомление без заголовка')
}

const showLongTimer = () => {
  notification.info(
    'Это сообщение будет отображаться 10 секунд',
    'Долгий таймер',
    10000
  )
}

const showNoTimer = () => {
  notification.warning(
    'Это сообщение не исчезнет автоматически',
    'Без таймера',
    0
  )
}
</script>
