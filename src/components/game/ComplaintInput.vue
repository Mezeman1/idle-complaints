<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '@/store'
import { complaints } from '@/data/complaints'
import Decimal from 'break_infinity.js'
import { useUpgradeStore } from '@/stores/upgrade-store'
import { formatNumber } from '@/utils/formatters'
import PointsPopup from './PointsPopup.vue'
import Toast from '@/components/base/Toast.vue'
import { useAchievementStore } from '@/stores/achievement-store'

const store = useStore()
const upgradeStore = useUpgradeStore()
const achievementStore = useAchievementStore()
const typingStartTime = ref(0)
const typingSpeedMultiplier = ref(1)

// Initialize with first complaint
if (!store.currentComplaint) {
  getNewComplaint()
}

const similarity = computed(() => {
  if (!store.currentComplaint || !store.typedText) return 0
  return calculateSimilarity(store.currentComplaint.toLowerCase(), store.typedText.toLowerCase())
})

function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0))

  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  const maxLength = Math.max(len1, len2)
  return ((maxLength - matrix[len1][len2]) / maxLength) * 100
}

function calculatePoints(text: string, accuracyPercent: number): number {
  // Base points: 1 point per character
  const basePoints = text.length

  // Bonus multiplier based on accuracy (90-100%)
  // At 90% accuracy: 1x multiplier
  // At 95% accuracy: 1.5x multiplier
  // At 100% accuracy: 2x multiplier
  const accuracyBonus = 1 + Math.max(0, (accuracyPercent - 90) / 10)

  // Length bonus: Additional 10% per 10 characters after the first 20
  const lengthBonus = Math.max(0, (text.length - 20) / 10) * 0.1

  return Math.round(basePoints * (1 + lengthBonus) * accuracyBonus)
}

function getNewComplaint() {
  const randomComplaint = complaints[Math.floor(Math.random() * complaints.length)]
  store.setCurrentComplaint(randomComplaint.text)
}

function handleInput(event: Event) {
  const input = (event.target as HTMLInputElement).value
  // Start timing when user starts typing
  if (input.length === 1 && !typingStartTime.value) {
    typingStartTime.value = Date.now()
  }
  // Calculate current typing speed and multiplier
  if (typingStartTime.value && input.length > 0) {
    const timeElapsed = Date.now() - typingStartTime.value
    const speed = calculateTypingSpeed(input.length, timeElapsed)
    typingSpeedMultiplier.value = getSpeedMultiplier(speed)
  }
  store.typedText = input
}

function handleSubmit() {
  if (similarity.value >= 90) {
    const basePoints = new Decimal(calculatePoints(store.currentComplaint, similarity.value))
    const upgradeStore = useUpgradeStore()
    const multiplier = upgradeStore.getTotalMultiplier
    const finalPoints = multiplier.times(basePoints).times(typingSpeedMultiplier.value).round()
    store.addScore(finalPoints)

    // Increment complaint counter and check achievements
    achievementStore.incrementStat('totalComplaints')
    achievementStore.checkAchievements(store)

    // Add popup
    const x = Math.random() * 40 - 20
    const y = Math.random() * 20 - 40
    popups.value.push({
      id: popupCounter++,
      points: finalPoints,
      multiplier,
      speedMultiplier: typingSpeedMultiplier.value,
      x,
      y,
    })

    // Remove popup after animation
    setTimeout(() => {
      popups.value = popups.value.filter(p => p.id !== popupCounter - 1)
    }, 1100)

    getNewComplaint()
    store.typedText = ''
    // Reset typing speed tracking
    typingStartTime.value = 0
    typingSpeedMultiplier.value = 1
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSubmit()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  showCheatToast()
}

function handleCopy(event: ClipboardEvent) {
  event.preventDefault()
  showCheatToast()
}

function handleCut(event: ClipboardEvent) {
  event.preventDefault()
  showCheatToast()
}

function handleContextMenu(event: MouseEvent) {
  event.preventDefault()
  showCheatToast()
}

// Add popup management
const popups = ref<{ id: number; points: Decimal; multiplier: Decimal; speedMultiplier: number; x: number; y: number }[]>([])
let popupCounter = 0

const wordAssistCooldown = ref(false)
const cooldownRemaining = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | undefined
const lastWordAssistTime = ref(0)

function handleWordAssist() {
  if (wordAssistCooldown.value) return

  const currentComplaint = store.currentComplaint
  const typedText = store.typedText
  const needsSpace = typedText.length > 0 && !typedText.endsWith(' ')

  // Get the next word from the complaint
  const remainingText = currentComplaint.slice(typedText.length).trim()
  const nextWord = remainingText.split(' ')[0]

  if (nextWord) {
    // Check if this is the last word
    const isLastWord = nextWord === remainingText.trim()
    store.typedText += (needsSpace ? ' ' : '') + nextWord + (!isLastWord ? ' ' : '')
    lastWordAssistTime.value = Date.now()

    // Check if complaint is complete
    if (store.typedText.trim() === currentComplaint.trim()) {
      handleSubmit()
    }
  }

  // Start cooldown
  const cooldownTime = Number(upgradeStore.getWordAssistCooldown)
  wordAssistCooldown.value = true
  cooldownRemaining.value = cooldownTime

  // Update countdown every 100ms
  cooldownInterval = setInterval(() => {
    cooldownRemaining.value = Math.max(0, cooldownRemaining.value - 0.1)
    if (cooldownRemaining.value <= 0) {
      wordAssistCooldown.value = false
      clearInterval(cooldownInterval)
    }
  }, 100)

  setTimeout(() => {
    wordAssistCooldown.value = false
    clearInterval(cooldownInterval)
  }, cooldownTime * 1000)
}

// Clean up interval on unmount
onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

const showWordAssist = computed(() => upgradeStore.upgrades.word_assist.level > 0)

// Add toast management
const showToast = ref(false)
const toastMessage = ref('')
let toastTimeout: ReturnType<typeof setTimeout> | undefined

const cheatMessages = [
  "Nice try! But we don't do that here... 😏",
  "Copy-paste? In MY complaint department? 🤨",
  "The only shortcuts here are the ones to frustration! 😤",
  "Typing builds character! And carpal tunnel... 😅",
  "That's not very complaint-like of you! 😠",
  "Manual labor is the best labor! 💪",
  "Shortcuts lead to the dark side! 🦹‍♂️",
]

function showCheatToast() {
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }

  toastMessage.value = cheatMessages[Math.floor(Math.random() * cheatMessages.length)]
  showToast.value = true

  toastTimeout = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Add computed for total points with multiplier
const potentialPoints = computed(() => {
  const basePoints = calculatePoints(store.currentComplaint, similarity.value)
  const multiplier = upgradeStore.getTotalMultiplier
  return multiplier.times(basePoints).round()
})

// Add computed for formatted multiplier
const currentMultiplier = computed(() => {
  const multiplier = upgradeStore.getTotalMultiplier
  return multiplier.eq(1) ? '' : `(${formatNumber(multiplier)}x multiplier)`
})

// Calculate typing speed (characters per second)
function calculateTypingSpeed(chars: number, timeInMs: number): number {
  return chars / (timeInMs / 1000)
}

// Calculate speed multiplier (1x to 3x based on typing speed)
function getSpeedMultiplier(speed: number): number {
  if (!upgradeStore.upgrades.speed_bonus.level) return 1

  // Base speed thresholds (characters per second)
  const minSpeed = 2  // 1x multiplier
  const maxSpeed = 8  // 3x multiplier

  const multiplier = 1 + (Math.min(Math.max(speed - minSpeed, 0), maxSpeed - minSpeed) / (maxSpeed - minSpeed)) * 2
  return multiplier
}

// Get color for speed bar based on multiplier
function getSpeedBarColor(multiplier: number): string {
  // Calculate progress from 0 to 1
  const progress = (multiplier - 1) / 2

  if (progress < 0.3) return '#FCD34D'  // yellow-300
  if (progress < 0.6) return '#FB923C'  // orange-400
  return '#EF4444'                      // red-500
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-8">
    <!-- Complaint Input Card -->
    <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg mb-4">
      <!-- Points popup container -->
      <div class="relative h-8">
        <div v-for="popup in popups" :key="popup.id" class="absolute left-1/2"
          :style="{ transform: `translate(-50%, ${popup.y}px)` }">
          <PointsPopup :points="popup.points" :multiplier="popup.multiplier" />
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <span class="text-lg">😤</span>
            </div>
          </div>
          <div class="flex-grow">
            <!-- Target Complaint -->
            <div class="mb-3 text-gray-800 dark:text-gray-200 text-sm">
              <div class="font-medium mb-1">Complaint to type:</div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                {{ store.currentComplaint }}
              </div>
            </div>

            <!-- Input Textarea -->
            <textarea :value="store.typedText" @input="handleInput" @keydown="handleKeydown" @paste="handlePaste"
              @copy="handleCopy" @cut="handleCut" @contextmenu="handleContextMenu" rows="3" class="w-full p-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg
                     text-gray-800 dark:text-gray-200 resize-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent" placeholder="Type the complaint here...">
            </textarea>

            <!-- Stats Bar -->
            <div class="flex flex-col space-y-3 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <!-- Top Row: Accuracy and Speed -->
              <div class="flex items-center space-x-6">
                <span>Accuracy: {{ Math.round(similarity) }}%</span>
                <!-- Speed Multiplier Bar -->
                <div v-if="upgradeStore.upgrades.speed_bonus.level" class="inline-flex items-center gap-2">
                  <span class="text-yellow-500 dark:text-yellow-400">
                    Speed: {{ typingSpeedMultiplier.toFixed(1) }}x
                  </span>
                  <div class="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-200" :style="{
                      width: `${((typingSpeedMultiplier - 1) / 2) * 100}%`,
                      backgroundColor: getSpeedBarColor(typingSpeedMultiplier)
                    }">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Middle Row: Points -->
              <div class="flex items-center">
                <span>
                  Points: {{ formatNumber(potentialPoints) }}
                  <span v-if="currentMultiplier" class="text-blue-500 dark:text-blue-400">
                    {{ currentMultiplier }}
                  </span>
                </span>
              </div>

              <!-- Bottom Row: Buttons -->
              <div class="flex items-center justify-end gap-3">
                <button v-if="showWordAssist" @click="handleWordAssist" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
                         disabled:opacity-50 disabled:cursor-not-allowed font-medium
                         transition-colors duration-200" :disabled="wordAssistCooldown">
                  Type Word
                  <span v-if="wordAssistCooldown" class="text-xs ml-1">
                    ({{ cooldownRemaining.toFixed(1) }}s)
                  </span>
                </button>
                <button @click="handleSubmit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                         disabled:opacity-50 disabled:cursor-not-allowed font-medium
                         transition-colors duration-200" :disabled="similarity < 90">
                  Post Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Previous Complaint Preview -->
    <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 mb-4">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Previous complaint worth:
        <span class="font-medium text-gray-700 dark:text-gray-300">
          {{ formatNumber(calculatePoints(store.currentComplaint, 100) * upgradeStore.getTotalMultiplier) }} points
        </span>
        at 100% accuracy
        <span v-if="currentMultiplier" class="text-blue-500 dark:text-blue-400 ml-1">
          {{ currentMultiplier }}
        </span>
      </div>
    </div>

    <Transition enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0">
      <Toast v-if="showToast" :message="toastMessage" />
    </Transition>
  </div>
</template>

<style scoped>
textarea::placeholder {
  opacity: 0.5;
  color: inherit;
}
</style>
