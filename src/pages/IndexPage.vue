<script setup lang="ts">
import { useStore } from '@/store'
import Navbar from '@/components/base/Navbar.vue'
import ComplaintInput from '@/components/game/ComplaintInput.vue'

const store = useStore()
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <div class="container mx-auto p-4">
      <ComplaintInput />
    </div>
  </div>
</template>
