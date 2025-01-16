<template>
  <div>
    <Navbar>
      <template #left>
        <button @click="emit('update:currentTab', 'game')"
          class="flex items-center px-3 py-2 rounded-md text-sm font-medium" :class="{
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white': currentTab === 'game',
            'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700': currentTab !== 'game'
          }">
          Game
        </button>
        <button @click="emit('update:currentTab', 'achievements')"
          class="flex items-center px-3 py-2 rounded-md text-sm font-medium" :class="{
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white': currentTab === 'achievements',
            'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700': currentTab !== 'achievements'
          }">
          Achievements
        </button>
        <button @click="emit('update:currentTab', 'collection')"
          class="flex items-center px-3 py-2 rounded-md text-sm font-medium" :class="{
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white': currentTab === 'collection',
            'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700': currentTab !== 'collection'
          }">
          Collection
        </button>
      </template>
    </Navbar>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/base/Navbar.vue'

defineProps<{
  currentTab: string
}>()

const emit = defineEmits<{
  'update:currentTab': [value: string]
}>()
</script>
