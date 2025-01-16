<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUpgradeStore } from '@/stores/upgrade-store'
import { useStore } from '@/store'
import { formatNumber } from '@/utils/formatters'
import { complaints } from '@/data/complaints'
import Decimal from 'break_infinity.js'

const store = useStore()
const upgradeStore = useUpgradeStore()

// Auto-score processing
let autoScoreInterval: number | undefined

onMounted(() => {
  autoScoreInterval = setInterval(() => {
    store.processAutoScore()
  }, 100)
})

onUnmounted(() => {
  if (autoScoreInterval) clearInterval(autoScoreInterval)
})

// Typing animation
const currentText = ref('')
const targetText = ref(complaints[0].text)
let typingInterval: number | undefined

const scorePerSecond = computed(() => {
  const typingSpeed = upgradeStore.getAutoTypingSpeed
  if (typingSpeed.eq(0)) return new Decimal(0)

  const avgComplaintLength = 50
  const basePoints = new Decimal(avgComplaintLength)
  const multiplier = upgradeStore.getTotalMultiplier

  return basePoints.times(multiplier).times(typingSpeed.div(avgComplaintLength))
})

function startNewComplaint() {
  const randomComplaint = complaints[Math.floor(Math.random() * complaints.length)]
  targetText.value = randomComplaint.text
  currentText.value = ''
}

function updateTyping() {
  if (typingInterval) clearInterval(typingInterval)

  const charsPerSecond = Number(upgradeStore.getAutoTypingSpeed)
  if (charsPerSecond === 0) return

  typingInterval = setInterval(() => {
    if (currentText.value.length >= targetText.value.length) {
      startNewComplaint()
      return
    }

    currentText.value += targetText.value[currentText.value.length]
  }, 1000 / (charsPerSecond * 2)) // *2 to make it look a bit faster
}

watch(() => upgradeStore.getAutoTypingSpeed, updateTyping, { immediate: true })

onMounted(() => {
  startNewComplaint()
  updateTyping()
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<template>
  <div v-if="scorePerSecond.gt(0)" class="max-w-xl mx-auto mt-4">
    <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg">
      <div class="p-4">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <span class="text-lg">🤖</span>
            </div>
          </div>
          <div class="flex-grow">
            <!-- Auto-typing preview -->
            <div class="p-2 border border-gray-200 dark:border-gray-600 rounded-lg
                      text-gray-600 dark:text-gray-300 font-mono text-sm min-h-[4rem]">
              {{ currentText }}<span class="animate-pulse">|</span>
            </div>

            <!-- Stats Bar -->
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Auto-Bot active</span>
              <span>{{ formatNumber(scorePerSecond) }} points/sec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
