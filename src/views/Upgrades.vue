<script setup lang="ts">
import { useUpgradeStore } from '@/stores/upgrade-store'
import UpgradeCard from '@/components/game/UpgradeCard.vue'

const upgradeStore = useUpgradeStore()

function handlePurchase(upgradeId: string) {
  upgradeStore.purchaseUpgrade(upgradeId)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upgrades</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UpgradeCard v-for="upgrade in upgradeStore.getVisibleUpgrades" :key="upgrade.id" :upgrade="upgrade"
        :canPurchase="upgradeStore.canPurchaseUpgrade(upgrade.id)" @purchase="handlePurchase(upgrade.id)" />
    </div>
  </div>
</template>
