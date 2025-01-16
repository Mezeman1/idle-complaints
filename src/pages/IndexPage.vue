<script setup lang="ts">
import { useStore } from '@/store'
import { useUpgradeStore } from '@/stores/upgrade-store'
import Navbar from '@/components/base/Navbar.vue'
import ComplaintInput from '@/components/game/ComplaintInput.vue'
import Upgrades from '@/components/game/Upgrades.vue'
import AutoTypingPreview from '@/components/game/AutoTypingPreview.vue'

const store = useStore()
const upgradeStore = useUpgradeStore()

// Load save data when the game starts
store.loadGame()
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <div class="container mx-auto p-4">
      <ComplaintInput />
      <AutoTypingPreview />
      <Upgrades />
    </div>
  </div>
</template>
