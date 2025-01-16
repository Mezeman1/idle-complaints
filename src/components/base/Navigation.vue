<template>
  <div>
    <Navbar>
      <template #left>
        <!-- Navigation Tabs -->
        <div class="flex md:space-x-1 flex-col md:flex-row">
          <button v-for="tab in tabs" :key="tab.id" @click="emit('update:currentTab', tab.id)"
            class="px-4 py-2 text-sm font-medium transition-colors duration-150 md:border-b-2" :class="{
              'text-theme border-primary': currentTab === tab.id,
              'text-theme opacity-60 border-transparent hover:opacity-80 hover:border-primary hover:border-opacity-50':
                currentTab !== tab.id,
              'border-l-2 md:border-l-0': true // Mobile indicator
            }">
            {{ tab.name }}
          </button>
        </div>
      </template>
    </Navbar>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/base/Navbar.vue'

const tabs = [
  { id: 'game', name: 'Game' },
  { id: 'achievements', name: 'Achievements' },
  { id: 'collection', name: 'Collection' },
  { id: 'themes', name: 'Themes' },
]

defineProps<{
  currentTab: string
}>()

const emit = defineEmits<{
  'update:currentTab': [value: string]
}>()
</script>
