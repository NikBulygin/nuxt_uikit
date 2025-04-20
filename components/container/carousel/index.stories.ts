import type { Meta, StoryObj } from '@storybook/vue3'
import Carousel from './index.vue'

const meta = {
  title: 'Container/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    showControls: {
      control: 'boolean',
      description: 'Show navigation controls'
    },
    gap: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Space between items'
    },
    smooth: {
      control: 'boolean',
      description: 'Use smooth scrolling'
    },
    showOverflow: {
      control: 'boolean',
      description: 'Show content that overflows the container'
    }
  }
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    showControls: true,
    gap: 16,
    smooth: true,
    showOverflow: false
  },
  render: args => ({
    components: { Carousel },
    setup() {
      const products = [
        {
          id: 1,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'grape'
          )}`,
          title: 'Cocktail',
          description: 'Tropical mix of flavors, perfect for parties.',
          price: 8.99,
          link: 'https://example.com'
        },
        {
          id: 2,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'apple'
          )}`,
          title: 'Smoothie',
          description: 'Refreshing blend of fruits and yogurt.',
          price: 5.49,
          link: 'https://example.com'
        },
        {
          id: 3,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'banana'
          )}`,
          title: 'Iced Coffee',
          description: 'Cold brewed coffee with a hint of vanilla.',
          price: 4.99,
          link: 'https://example.com'
        },
        {
          id: 4,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'berry'
          )}`,
          title: 'Mojito',
          description: 'Classic Cuban cocktail with mint and lime.',
          price: 7.99,
          link: 'https://example.com'
        },
        {
          id: 5,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'orange'
          )}`,
          title: 'Matcha Latte',
          description: 'Creamy green tea latte, rich in antioxidants.',
          price: 6.49,
          link: 'https://example.com'
        },
        {
          id: 6,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'peach'
          )}`,
          title: 'Fruit Punch',
          description:
            'Sweet and tangy punch, bursting with fruity flavors.',
          price: 3.99,
          link: 'https://example.com'
        },
        {
          id: 7,
          image: `https://loremflickr.com/300/200/${encodeURIComponent(
            'cherry'
          )}`,
          title: 'Bubble Tea',
          description: 'Chewy tapioca pearls in a sweet milk tea base.',
          price: 4.99,
          link: 'https://example.com'
        }
      ]

      return { args, products }
    },
    template: `
      <div class="p-4">
        <Carousel v-bind="args">
          <!-- Each product card with responsive classes -->
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="card flex-none snap-center w-64 sm:w-72 md:w-80 lg:w-64"
          >
            <div class="bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img :src="product.image" :alt="product.title" class="w-full h-40 object-cover">
              <div class="p-4">
                <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100">{{ product.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm">{{ product.description }}</p>
                <div class="flex justify-between items-center mt-4">
                  <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ '$' + product.price.toFixed(2) }}</span>
                  <a 
                    :href="product.link"
                    class="text-white bg-fuchsia-950 hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    `
  })
}
