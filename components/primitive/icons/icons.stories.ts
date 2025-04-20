import type { Meta, StoryObj } from '@storybook/vue3'
import IconInfo from './IconInfo.vue'
import IconSuccess from './IconSuccess.vue'
import IconWarning from './IconWarning.vue'
import IconDanger from './IconDanger.vue'

// Info Icon
const metaInfo = {
  title: 'Primitive/Icons/Info',
  component: IconInfo,
  tags: ['autodocs'],
  argTypes: {
    class: { control: 'text' }
  }
} satisfies Meta<typeof IconInfo>

export default metaInfo
type InfoStory = StoryObj<typeof metaInfo>

export const InfoIcon: InfoStory = {
  render: () => ({
    components: { IconInfo },
    template: `<div class="w-10 h-10 text-blue-500"><IconInfo /></div>`
  })
}

// Success Icon
export const SuccessIcon = {
  render: () => ({
    components: { IconSuccess },
    template: `<div class="w-10 h-10 text-green-500"><IconSuccess /></div>`
  })
} satisfies StoryObj<Meta<typeof IconSuccess>>

// Warning Icon
export const WarningIcon = {
  render: () => ({
    components: { IconWarning },
    template: `<div class="w-10 h-10 text-yellow-500"><IconWarning /></div>`
  })
} satisfies StoryObj<Meta<typeof IconWarning>>

// Danger Icon
export const DangerIcon = {
  render: () => ({
    components: { IconDanger },
    template: `<div class="w-10 h-10 text-red-500"><IconDanger /></div>`
  })
} satisfies StoryObj<Meta<typeof IconDanger>>
