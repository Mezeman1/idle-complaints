<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/store'
import Decimal from 'break_infinity.js'
import { formatNumber } from '@/utils/formatters'

const store = useStore()
const showSaveModal = ref(false)
const showResetConfirm = ref(false)
const importString = ref('')
const showImportError = ref(false)
const showImportSuccess = ref(false)
const showExportSuccess = ref(false)
const isResetting = ref(false)
const isMobileMenuOpen = ref(false)

function formatScore(score: Decimal): string {
  return formatNumber(score)
}

function handleImport() {
  try {
    store.importSave(importString.value)
    showImportError.value = false
    showImportSuccess.value = true
    importString.value = ''
    showSaveModal.value = false
    setTimeout(() => {
      showImportSuccess.value = false
    }, 3000)
  } catch (error) {
    showImportError.value = true
    setTimeout(() => {
      showImportError.value = false
    }, 3000)
  }
}

function handleExport() {
  const saveString = store.exportSave()
  navigator.clipboard.writeText(saveString)
  showExportSuccess.value = true
  showSaveModal.value = false
  setTimeout(() => {
    showExportSuccess.value = false
  }, 3000)
}

function handleReset() {
  isResetting.value = true
  store.resetGame()
  showResetConfirm.value = false
  showSaveModal.value = false
}

// Modify auto-save to check flag
setInterval(() => {
  if (!isResetting.value) {
    store.saveGame()
  }
}, 60000)

// Modify beforeunload handler
window.addEventListener('beforeunload', () => {
  if (!isResetting.value) {
    store.saveGame()
  }
})

// Add click outside handler
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (isMobileMenuOpen.value &&
    !target.closest('.mobile-menu') &&
    !target.closest('.mobile-menu-button')) {
    isMobileMenuOpen.value = false
  }
  if (showSaveModal.value && !target.closest('.save-modal') && !target.closest('.save-button')) {
    showSaveModal.value = false
    showResetConfirm.value = false
  }
}

function toggleSaveModal() {
  showSaveModal.value = !showSaveModal.value
  showResetConfirm.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="card-theme shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button @click="toggleMobileMenu" class="mobile-menu-button p-2 rounded-lg hover:bg-theme text-theme">
            <span class="text-2xl">☰</span>
          </button>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-4">
          <slot name="left"></slot>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Score Display -->
          <div class="hidden sm:flex text-theme space-x-4">
            <span>Score: {{ formatScore(store.score) }}</span>
            <span class="text-theme opacity-70">
              Highest: {{ formatScore(store.highestScore) }}
            </span>
          </div>

          <!-- Buy Me a Coffee -->
          <a href="https://buymeacoffee.com/idleantfarm" target="_blank" rel="noopener noreferrer"
            class="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#FFDD00] hover:bg-[#FFDD00]/90 transition-colors">
            <span class="text-black text-sm font-medium">☕ Buy me a coffee</span>
          </a>

          <!-- Save Management -->
          <button @click="toggleSaveModal" class="p-2 rounded-lg hover:bg-theme text-theme opacity-80 save-button">
            💾
          </button>

          <!-- Dark Mode Toggle -->
          <button @click="store.toggleDarkMode" class="p-2 rounded-lg hover:bg-theme">
            <span v-if="store.darkMode" class="accent-theme">☀️</span>
            <span v-else class="text-theme opacity-70">🌙</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mobile-menu border-t border-theme">
        <div class="py-2">
          <slot name="left"></slot>
        </div>
        <!-- Mobile Score Display -->
        <div class="py-2 border-t border-theme text-theme">
          <div class="px-2 py-1">Score: {{ formatScore(store.score) }}</div>
          <div class="px-2 py-1 opacity-70">
            Highest: {{ formatScore(store.highestScore) }}
          </div>
        </div>
        <!-- Mobile Buy Me a Coffee -->
        <div class="py-2 border-t border-theme">
          <a href="https://buymeacoffee.com/idleantfarm" target="_blank" rel="noopener noreferrer"
            class="block px-2 py-1">
            <span class="text-theme">☕ Buy me a coffee</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Save Modal -->
    <div v-if="showSaveModal"
      class="absolute right-4 top-[calc(100%+0.5rem)] w-96 card-theme rounded-lg shadow-lg p-4 z-50 save-modal">
      <div class="space-y-4">
        <!-- Import -->
        <div>
          <label class="block text-theme opacity-80 mb-2 text-sm">Import Save:</label>
          <div class="flex space-x-2">
            <input v-model="importString" type="text"
              class="flex-1 p-2 text-sm border rounded-lg bg-theme text-theme border-theme"
              placeholder="Paste save string here...">
            <button @click="handleImport" class="btn-primary">
              Import
            </button>
          </div>
          <p v-if="showImportError" class="text-red-500 mt-2 text-sm">Invalid save data</p>
        </div>

        <!-- Export -->
        <div>
          <button @click="handleExport" class="w-full btn-primary">
            Export Save to Clipboard
          </button>
        </div>

        <!-- Reset -->
        <div class="pt-2 border-t border-theme">
          <button v-if="!showResetConfirm" @click="showResetConfirm = true" class="w-full btn-secondary">
            Reset Game
          </button>
          <div v-else class="space-y-2">
            <p class="text-sm text-red-500">Are you sure? This cannot be undone!</p>
            <div class="flex space-x-2">
              <button @click="handleReset" class="flex-1 btn-secondary">
                Yes, Reset
              </button>
              <button @click="showResetConfirm = false" class="flex-1 btn-primary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Success Notifications -->
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform translate-y-2 opacity-0">
    <div v-if="showExportSuccess || showImportSuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      {{ showExportSuccess ? 'Save copied to clipboard!' : 'Save imported successfully!' }}
    </div>
  </Transition>
</template>
