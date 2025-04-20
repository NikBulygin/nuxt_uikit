<template>
  <Transition name="message-slide">
    <div
      v-if="visible"
      @click="close"
      :class="[
        'px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg transition-all duration-300 cursor-pointer w-full sm:max-w-md',
        typeClasses
      ]"
    >
      <div class="flex items-center">
        <div class="mr-2 sm:mr-3 flex-shrink-0">
          <IconInfo v-if="type === 'info'" class="w-4 h-4 sm:w-5 sm:h-5" />
          <IconSuccess
            v-else-if="type === 'success'"
            class="w-4 h-4 sm:w-5 sm:h-5"
          />
          <IconWarning
            v-else-if="type === 'warning'"
            class="w-4 h-4 sm:w-5 sm:h-5"
          />
          <IconDanger
            v-else-if="type === 'danger'"
            class="w-4 h-4 sm:w-5 sm:h-5"
          />
        </div>
        <div class="flex-1 text-sm sm:text-base">
          <p v-if="title" class="font-semibold mb-0.5 sm:mb-1">
            {{ title }}
          </p>
          <p>{{ message }}</p>
        </div>
        <button
          @click.stop="close"
          class="ml-2 text-current opacity-70 hover:opacity-100 flex-shrink-0"
        >
          <span class="sr-only">Закрыть</span>
          <svg
            class="w-3 h-3 sm:w-4 sm:h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div
        v-if="timer > 0"
        class="mt-1.5 sm:mt-2 w-full bg-black/10 dark:bg-white/10 h-0.5 sm:h-1 rounded-full overflow-hidden"
      >
        <div
          class="h-full bg-current opacity-60"
          :style="{ width: `${timerProgress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  type: 'info' | 'success' | 'warning' | 'danger'
  message: string
  title?: string
  timer?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  timer: 5000,
  title: '',
  id: ''
})

const emit = defineEmits<{
  (e: 'close', id?: string): void
}>()

const visible = ref(true)
const timerProgress = ref(100)
let timeoutId: NodeJS.Timeout | null = null
let animationFrameId: number | null = null
const startTime = ref(Date.now())

const typeClasses = computed(() => {
  switch (props.type) {
    case 'info':
      return 'bg-info-light text-info dark:bg-info-dark dark:text-info-light'
    case 'success':
      return 'bg-success-light text-success dark:bg-success-dark dark:text-success-light'
    case 'warning':
      return 'bg-warning-light text-warning dark:bg-warning-dark dark:text-warning-light'
    case 'danger':
      return 'bg-danger-light text-danger dark:bg-danger-dark dark:text-danger-light'
    default:
      return 'bg-info-light text-info dark:bg-info-dark dark:text-info-light'
  }
})

const close = () => {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  emit('close', props.id)
}

const updateTimerProgress = () => {
  if (!visible.value || props.timer <= 0) return

  const elapsed = Date.now() - startTime.value
  timerProgress.value = Math.max(0, 100 - (elapsed / props.timer) * 100)

  if (timerProgress.value > 0) {
    animationFrameId = requestAnimationFrame(updateTimerProgress)
  }
}

onMounted(() => {
  if (props.timer > 0) {
    startTime.value = Date.now()
    timeoutId = setTimeout(close, props.timer)
    animationFrameId = requestAnimationFrame(updateTimerProgress)
  }
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.message-slide-enter-active,
.message-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.message-slide-enter-from,
.message-slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

@media (max-width: 640px) {
  .message-slide-enter-from,
  .message-slide-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
