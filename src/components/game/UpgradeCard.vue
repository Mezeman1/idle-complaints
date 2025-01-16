<script setup lang="ts">
import { computed } from 'vue'
import { useUpgradeStore } from '@/stores/upgrade-store'
import { formatNumber } from '@/utils/formatters'
import type { Upgrade } from '@/types'

const props = defineProps<{
  upgrade: Upgrade
  canPurchase: boolean
}>()

const upgradeStore = useUpgradeStore()

const isMaxLevel = computed(() => {
  if (!props.upgrade.maxLevel) return false
  return props.upgrade.level >= props.upgrade.maxLevel
})

const buttonText = computed(() => {
  if (isMaxLevel.value) return 'Maxed'
  return `Buy (${formatNumber(upgradeStore.getUpgradeCost(props.upgrade.id))})`
})

const description = computed(() => {
  let desc = props.upgrade.description.replace(
    '{effect}',
    formatNumber(props.upgrade.effect)
  )
  if (isMaxLevel.value) {
    desc += ' (Maximum level reached)'
  }
  return desc
})
</script>

<template>
  <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        {{ upgrade.name }} 
      </h3>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Level: {{ upgrade.level }}{{ upgrade.maxLevel ? ` / ${upgrade.maxLevel}` : '' }}
      </div>
    </div>

    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
      {{ description }}
    </p>

    <button @click="$emit('purchase')" class="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors" :class="{
      'bg-blue-500 hover:bg-blue-600 text-white': canPurchase && !isMaxLevel,
      'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400': !canPurchase || isMaxLevel
    }" :disabled="!canPurchase || isMaxLevel">
      {{ buttonText }}
    </button>
  </div>
</template>
