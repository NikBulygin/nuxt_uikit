<template>
  <div class="container mx-auto p-6">
    <h1 class="text-h2 mb-8">Text Input Component Examples</h1>

    <!-- Basic text input -->
    <div class="mb-8">
      <h2 class="text-h4 mb-4">Basic Text Input</h2>
      <TextInput
        v-model="basicText"
        label="Name"
        placeholder="Enter your name"
      >
        <template #helper> Please enter your full name </template>
      </TextInput>
      <div class="mt-2">Current value: {{ basicText }}</div>
    </div>

    <!-- Password input with validation -->
    <div class="mb-8">
      <h2 class="text-h4 mb-4">Password with Strong Validation</h2>
      <TextInput
        v-model="password"
        label="Password"
        placeholder="Enter your password"
        :hide-text="true"
        validation-type="strongPassword"
        :validate-on-input="true"
        @valid="handlePasswordValid"
      >
        <template #helper>
          <span>
            Password must contain:
            <ul class="list-disc ml-5 mt-1">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </span>
        </template>
      </TextInput>
      <div class="mt-2">
        Password length: {{ password.length }} characters
        <span v-if="passwordValid" class="ml-2 text-success">✓ Valid</span>
      </div>
    </div>

    <!-- Email validation -->
    <div class="mb-8">
      <h2 class="text-h4 mb-4">Email Validation</h2>
      <TextInput
        v-model="email"
        label="Email"
        placeholder="Enter your email"
        validation-type="email"
        :required="true"
        :validate-on-input="true"
        @valid="handleEmailValid"
      >
        <template #helper>
          <span>
            We'll never share your email with anyone.
            <a href="#" class="text-primary hover:underline"
              >Privacy Policy</a
            >
          </span>
        </template>
      </TextInput>
      <div class="mt-2">
        Current email: {{ email }}
        <span v-if="emailValid" class="ml-2 text-success">✓ Valid</span>
      </div>
    </div>

    <!-- Multiline text input -->
    <div class="mb-8">
      <h2 class="text-h4 mb-4">Multiline Text Input</h2>
      <TextInput
        v-model="message"
        label="Message"
        placeholder="Enter your message"
        :multiline="true"
        :rows="4"
        :max-length="100"
        :show-counter="true"
        helper-text="Please be concise"
      />
      <div class="mt-2">Character count: {{ message.length }}/100</div>
    </div>

    <!-- Phone number with validation -->
    <div class="mb-8">
      <h2 class="text-h4 mb-4">Phone Number Validation</h2>
      <TextInput
        v-model="phone"
        label="Phone Number"
        placeholder="Enter your phone number"
        validation-type="phone"
        :required="true"
        :validate-on-input="true"
        @valid="handlePhoneValid"
      >
        <template #helper>
          Include country code (e.g., <span class="font-mono">+1</span> for
          US)
        </template>
      </TextInput>
      <div class="mt-2">
        Current phone: {{ phone }}
        <span v-if="phoneValid" class="ml-2 text-success">✓ Valid</span>
      </div>
    </div>

    <!-- Numbers only input -->
    <div class="mb-8">
      <h2 class="text-h4 mb-4">Numbers Only</h2>
      <TextInput
        v-model="age"
        label="Age"
        placeholder="Enter your age"
        validation-type="numbersOnly"
        :validate-on-input="true"
        helper-text="Please enter a number"
        @valid="handleAgeValid"
      />
      <div class="mt-2">
        Current age: {{ age }}
        <span v-if="ageValid" class="ml-2 text-success">✓ Valid</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '~/components/primitive/input/text.vue'
import { useNotification } from '~/composables/useNotification'

// Setup notification system
const notification = useNotification()

// Form values
const basicText = ref('')
const password = ref('')
const email = ref('')
const message = ref('')
const phone = ref('')
const age = ref('')

// Validation states
const passwordValid = ref(false)
const emailValid = ref(false)
const phoneValid = ref(false)
const ageValid = ref(false)

// Validation handlers
const handlePasswordValid = (isValid: boolean) => {
  passwordValid.value = isValid
  if (isValid && password.value) {
    notification.success(
      'Password meets complexity requirements!',
      'Success'
    )
  }
}

const handleEmailValid = (isValid: boolean) => {
  emailValid.value = isValid
  if (isValid && email.value) {
    notification.success('Valid email address!', 'Success')
  }
}

const handlePhoneValid = (isValid: boolean) => {
  phoneValid.value = isValid
  if (isValid && phone.value) {
    notification.success('Valid phone number!', 'Success')
  }
}

const handleAgeValid = (isValid: boolean) => {
  ageValid.value = isValid
  if (isValid && age.value) {
    notification.success('Valid age entered!', 'Success')
  }
}
</script>
