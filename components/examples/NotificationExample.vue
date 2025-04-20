<template>
  <div class="p-2 sm:p-4 space-y-3 sm:space-y-4">
    <h2 class="text-lg sm:text-xl font-semibold">Примеры уведомлений</h2>
    <div class="flex flex-wrap gap-2 sm:gap-4">
      <Button class="text-sm sm:text-base" @click="showInfoNotification"
        >Информация</Button
      >
      <Button class="text-sm sm:text-base" @click="showSuccessNotification"
        >Успех</Button
      >
      <Button class="text-sm sm:text-base" @click="showWarningNotification"
        >Предупреждение</Button
      >
      <Button class="text-sm sm:text-base" @click="showDangerNotification"
        >Ошибка</Button
      >
      <Button class="text-sm sm:text-base" @click="showWithoutTitle"
        >Без заголовка</Button
      >
      <Button class="text-sm sm:text-base" @click="showLongTimer"
        >Долгий таймер (10с)</Button
      >
      <Button class="text-sm sm:text-base" @click="showNoTimer"
        >Без таймера</Button
      >
      <Button class="text-sm sm:text-base" @click="showMultiple"
        >Несколько сразу</Button
      >
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

const showMultiple = () => {
  notification.info('Первое информационное сообщение', 'Инфо 1', 3000)
  setTimeout(() => {
    notification.success('Второе сообщение об успехе', 'Успех 2', 4000)
  }, 300)
  setTimeout(() => {
    notification.warning('Третье предупреждение', 'Внимание 3', 5000)
  }, 600)
  setTimeout(() => {
    notification.danger('Четвертое сообщение об ошибке', 'Ошибка 4', 6000)
  }, 900)
}
</script>
