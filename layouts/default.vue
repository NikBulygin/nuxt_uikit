<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b">
      <div class="container flex h-16 items-center justify-between px-4">
        <NuxtLink to="/" class="font-semibold">
          Logo
        </NuxtLink>
        <nav class="flex items-center gap-4">
          <ThemeToggle />
        </nav>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout will automatically use ThemeToggle component
</script> 