<script setup lang="ts">
import { useStore } from '@/store'
import { useUpgradeStore } from '@/stores/upgrade-store'
import ComplaintInput from '@/components/game/ComplaintInput.vue'
import Upgrades from '@/components/game/Upgrades.vue'
import AutoTypingPreview from '@/components/game/AutoTypingPreview.vue'
import Navigation from '@/components/base/Navigation.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto p-4">
      <ComplaintInput />
      <AutoTypingPreview />
      <Upgrades />
    </div>
  </div>
</template>
