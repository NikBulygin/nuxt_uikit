<template>
  <div
    class="carousel-container relative"
    :class="{ 'overflow-hidden': !showOverflow }"
  >
    <!-- Carousel track - using native scrolling with snap points -->
    <div
      ref="scrollContainer"
      class="carousel-track flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      :style="{ gap: `${gap}px` }"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mousemove="onDrag"
      @touchmove="onDrag"
      @mouseleave="endDrag"
    >
      <!-- Slot for carousel items -->
      <slot></slot>
    </div>

    <!-- Optional navigation arrows -->
    <button
      v-if="showControls"
      @click="scrollPrev"
      class="carousel-control absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-dark-surface rounded-full p-2 shadow-md transition-opacity"
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-text-primary dark:text-dark-text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <button
      v-if="showControls"
      @click="scrollNext"
      class="carousel-control absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-dark-surface rounded-full p-2 shadow-md transition-opacity"
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-text-primary dark:text-dark-text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface CarouselProps {
  /**
   * Show navigation controls
   */
  showControls?: boolean

  /**
   * Space between items
   */
  gap?: number

  /**
   * Scroll behavior
   */
  smooth?: boolean

  /**
   * Show overflow content
   */
  showOverflow?: boolean
}

const props = withDefaults(defineProps<CarouselProps>(), {
  showControls: true,
  gap: 16,
  smooth: true,
  showOverflow: false
})

// State for drag handling
const scrollContainer = ref<HTMLElement | null>(null)
const isDown = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// Start dragging
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDown.value = true

  if (!scrollContainer.value) return

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  startX.value = clientX - scrollContainer.value.offsetLeft
  scrollLeft.value = scrollContainer.value.scrollLeft

  // Add grabbing cursor
  scrollContainer.value.classList.add('active')
}

// Handle drag movement
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDown.value || !scrollContainer.value) return

  e.preventDefault()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const x = clientX - scrollContainer.value.offsetLeft
  const walk = (x - startX.value) * 1 // Scroll speed multiplier

  scrollContainer.value.scrollLeft = scrollLeft.value - walk
}

// End dragging
const endDrag = () => {
  isDown.value = false

  if (!scrollContainer.value) return
  scrollContainer.value.classList.remove('active')
}

// Navigation methods
const scrollNext = () => {
  if (!scrollContainer.value) return

  const itemWidth =
    scrollContainer.value.querySelector('.card')?.clientWidth || 0
  const scrollAmount = itemWidth + props.gap

  scrollContainer.value.scrollBy({
    left: scrollAmount,
    behavior: props.smooth ? 'smooth' : 'auto'
  })
}

const scrollPrev = () => {
  if (!scrollContainer.value) return

  const itemWidth =
    scrollContainer.value.querySelector('.card')?.clientWidth || 0
  const scrollAmount = itemWidth + props.gap

  scrollContainer.value.scrollBy({
    left: -scrollAmount,
    behavior: props.smooth ? 'smooth' : 'auto'
  })
}

// Lifecycle hooks
onMounted(() => {
  // Add any initialization if needed
})

onBeforeUnmount(() => {
  // Clean up
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem;
  padding-bottom: 1rem; /* Extra space for scrollbar */
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-track.active {
  cursor: grabbing;
  cursor: -webkit-grabbing;
}

.carousel-control {
  z-index: 1;
}

/* Utility class */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
