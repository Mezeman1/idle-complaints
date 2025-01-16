<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  name: string
  icon: string
  bonus: {
    type: string
    amount: number
  }
}>()

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <div class="fixed bottom-20 right-4 z-50">
    <div class="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300"
      :class="{ 'translate-x-0 opacity-100': isVisible, 'translate-x-full opacity-0': !isVisible }">
      <div class="flex items-center space-x-3">
        <span class="text-2xl">{{ icon }}</span>
        <div>
          <div class="font-bold">Achievement Unlocked!</div>
          <div>{{ name }}</div>
          <div class="text-sm opacity-90">
            +{{ bonus.amount }}
            {{ bonus.type === 'multiplier' ? 'x points' :
               bonus.type === 'auto_typing' ? ' chars/sec' :
               ' word assist speed' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
