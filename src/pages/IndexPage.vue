<script setup lang="ts">
import { useStore } from '@/store'
import { useUpgradeStore } from '@/stores/upgrade-store'
import ComplaintInput from '@/components/game/ComplaintInput.vue'
import Upgrades from '@/components/game/Upgrades.vue'
import AutoTypingPreview from '@/components/game/AutoTypingPreview.vue'
import Navigation from '@/components/base/Navigation.vue'
import { formatNumber } from '@/utils/formatters'

const store = useStore()
</script>

<template>
  <div class="min-h-screen bg-theme">
    <!-- Mobile Score Display -->
    <div class="sm:hidden p-4 card-theme mb-4 shadow-lg">
      <div class="flex justify-between items-center">
        <div class="text-theme">
          Score: {{ formatNumber(store.score) }}
        </div>
        <div class="text-theme opacity-70">
          Highest: {{ formatNumber(store.highestScore) }}
        </div>
      </div>
    </div>

    <div class="container mx-auto p-4">
      <ComplaintInput />
      <AutoTypingPreview />
      <Upgrades />
    </div>
  </div>
</template>
