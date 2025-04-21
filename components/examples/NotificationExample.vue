<template>
  <div class="p-2 sm:p-4 space-y-3 sm:space-y-4">
    <h2 class="text-lg sm:text-xl font-semibold">{{ t('notifications.examples.title') }}</h2>
    <div class="flex flex-wrap gap-2 sm:gap-4">
      <Button class="text-sm sm:text-base" @click="showInfoNotification">
        {{ t('notifications.examples.buttons.info') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showSuccessNotification">
        {{ t('notifications.examples.buttons.success') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showWarningNotification">
        {{ t('notifications.examples.buttons.warning') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showDangerNotification">
        {{ t('notifications.examples.buttons.error') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showWithoutTitle">
        {{ t('notifications.examples.buttons.noTitle') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showLongTimer">
        {{ t('notifications.examples.buttons.longTimer') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showNoTimer">
        {{ t('notifications.examples.buttons.noTimer') }}
      </Button>
      <Button class="text-sm sm:text-base" @click="showMultiple">
        {{ t('notifications.examples.buttons.multiple') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '~/composables/useNotification'
import { useI18n } from 'vue-i18n'
import Button from '~/components/primitive/button/button.vue'

const notification = useNotification()
const { t } = useI18n()

const showInfoNotification = () => {
  notification.info(
    t('notifications.examples.messages.info'),
    t('notifications.examples.titles.info')
  )
}

const showSuccessNotification = () => {
  notification.success(
    t('notifications.examples.messages.success'),
    t('notifications.examples.titles.success')
  )
}

const showWarningNotification = () => {
  notification.warning(
    t('notifications.examples.messages.warning'),
    t('notifications.examples.titles.warning')
  )
}

const showDangerNotification = () => {
  notification.danger(
    t('notifications.examples.messages.error'),
    t('notifications.examples.titles.error')
  )
}

const showWithoutTitle = () => {
  notification.info(t('notifications.examples.messages.noTitle'))
}

const showLongTimer = () => {
  notification.info(
    t('notifications.examples.messages.longTimer'),
    t('notifications.examples.titles.longTimer'),
    10000
  )
}

const showNoTimer = () => {
  notification.warning(
    t('notifications.examples.messages.noTimer'),
    t('notifications.examples.titles.noTimer'),
    0
  )
}

const showMultiple = () => {
  notification.info(
    t('notifications.examples.messages.multiple.info'),
    t('notifications.examples.titles.multiple.info'),
    3000
  )
  setTimeout(() => {
    notification.success(
      t('notifications.examples.messages.multiple.success'),
      t('notifications.examples.titles.multiple.success'),
      4000
    )
  }, 300)
  setTimeout(() => {
    notification.warning(
      t('notifications.examples.messages.multiple.warning'),
      t('notifications.examples.titles.multiple.warning'),
      5000
    )
  }, 600)
  setTimeout(() => {
    notification.danger(
      t('notifications.examples.messages.multiple.error'),
      t('notifications.examples.titles.multiple.error'),
      6000
    )
  }, 900)
}
</script>
