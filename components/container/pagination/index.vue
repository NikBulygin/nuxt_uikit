<template>
    <div class="pagination flex items-center gap-1">
        <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600 dark:text-gray-300">
                {{ ((currentPage - 1) * itemsPerPage) + 1 }} 
                - {{ Math.min(currentPage * itemsPerPage, totalItems) }} 
                of {{ totalItems }}
            </div>

            <div class="flex items-center gap-1">
                <!-- First page -->
                <button 
                    class="p-1.5 rounded hover:bg-primary-100 dark:hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === 1"
                    @click="$emit('update:page', 1)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
                    </svg>
                </button>
                
                <!-- Previous page -->
                <button 
                    class="p-1.5 rounded hover:bg-primary-100 dark:hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === 1"
                    @click="$emit('update:page', currentPage - 1)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>

                <!-- Page numbers -->
                <div class="flex items-center">
                    <template v-for="pageNum in displayedPages" :key="pageNum">
                        <button 
                            v-if="pageNum !== '...'"
                            class="min-w-[28px] h-7 rounded text-sm flex items-center justify-center"
                            :class="pageNum === currentPage 
                                ? 'bg-primary-500 text-text-primary' 
                                : 'hover:bg-primary-100 dark:hover:bg-primary-400'"
                            @click="$emit('update:page', pageNum)"
                        >
                            {{ pageNum }}
                        </button>
                        <span 
                            v-else 
                            class="px-0.5 text-sm"
                        >
                            {{ pageNum }}
                        </span>
                    </template>
                </div>

                <!-- Next page -->
                <button 
                    class="p-1.5 rounded hover:bg-primary-100 dark:hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === totalPages"
                    @click="$emit('update:page', currentPage + 1)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>

                <!-- Last page -->
                <button 
                    class="p-1.5 rounded hover:bg-primary-100 dark:hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === totalPages"
                    @click="$emit('update:page', totalPages)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

const props = defineProps<Props>()

const { currentPage, totalPages } = toRefs(props)

const displayedPages = computed(() => {
    const current = currentPage.value
    const total = totalPages.value
    const delta = 1 // Показывать по 1 странице с каждой стороны
    
    const range = []
    const rangeWithDots = []
    let l

    range.push(1)
    
    for (let i = current - delta; i <= current + delta; i++) {
        if (i < total && i > 1) {
            range.push(i)
        }
    }
    
    if (total !== 1) {
        range.push(total)
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
})
</script> 