<script setup lang="ts">
import { computed } from 'vue'
import { useUpgradeStore } from '@/stores/upgrade-store'
import { formatNumber } from '@/utils/formatters'
import type { Upgrade } from '@/types'

const upgradeStore = useUpgradeStore()

// Move all the UpgradeCard logic directly into this component since it's the only place using it
const isMaxLevel = (upgrade: Upgrade) => {
  if (!upgrade.maxLevel) return false
  return upgrade.level >= upgrade.maxLevel
}

const getButtonText = (upgrade: Upgrade) => {
  if (isMaxLevel(upgrade)) return 'Maxed'
  return `Buy (${formatNumber(upgradeStore.getUpgradeCost(upgrade.id))})`
}

const getDescription = (upgrade: Upgrade) => {
  let desc = upgrade.description.replace(
    '{effect}',
    formatNumber(upgrade.effect)
  )
  if (isMaxLevel(upgrade)) {
    desc += ' (Maximum level reached)'
  }
  return desc
}

function handlePurchase(upgradeId: string) {
  upgradeStore.purchaseUpgrade(upgradeId)
}
</script>

<template>
  <div class="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="upgrade in upgradeStore.getVisibleUpgrades" :key="upgrade.id"
      class="card-theme rounded-lg shadow-lg p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-theme">
          {{ upgrade.name }}
        </h3>
        <div class="text-theme opacity-70">
          Level: {{ upgrade.level }}{{ upgrade.maxLevel ? ` / ${upgrade.maxLevel}` : '' }}
        </div>
      </div>

      <p class="text-sm text-theme opacity-80 mb-4">
        {{ getDescription(upgrade) }}
      </p>

      <button @click="handlePurchase(upgrade.id)"
        class="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors" :class="{
          'btn-primary': upgradeStore.canPurchaseUpgrade(upgrade.id) && !isMaxLevel(upgrade),
          'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-theme opacity-50':
            !upgradeStore.canPurchaseUpgrade(upgrade.id) || isMaxLevel(upgrade)
        }" :disabled="!upgradeStore.canPurchaseUpgrade(upgrade.id) || isMaxLevel(upgrade)">
        {{ getButtonText(upgrade) }}
      </button>
    </div>
  </div>
</template>
