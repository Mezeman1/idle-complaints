<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<template>
    <nav class="bg-white dark:bg-gray-800 shadow-md relative">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                    Idle Complaints
                </h1>
                <div class="flex items-center space-x-4">
                    <div class="text-gray-800 dark:text-white space-x-4">
                        <span>Score: {{ formatScore(store.score) }}</span>
                        <span class="text-gray-500 dark:text-gray-400">
                            Highest: {{ formatScore(store.highestScore) }}
                        </span>
                    </div>

                    <!-- Save Management Button -->
                    <button @click="showSaveModal = !showSaveModal"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        💾
                    </button>

                    <!-- Dark Mode Toggle -->
                    <button @click="store.toggleDarkMode"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span v-if="store.darkMode" class="text-yellow-500">☀️</span>
                        <span v-else class="text-gray-500">🌙</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Save Modal -->
        <div v-if="showSaveModal"
            class="absolute right-0 top-full mt-2 mr-4 w-96 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 z-50">
            <div class="space-y-4">
                <!-- Import -->
                <div>
                    <label class="block text-gray-700 dark:text-gray-300 mb-2 text-sm">Import Save:</label>
                    <div class="flex space-x-2">
                        <input v-model="importString" type="text"
                            class="flex-1 p-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            placeholder="Paste save string here...">
                        <button @click="handleImport"
                            class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
                            Import
                        </button>
                    </div>
                    <p v-if="showImportError" class="text-red-500 mt-2 text-sm">Invalid save data</p>
                    <p v-if="showImportSuccess" class="text-green-500 mt-2 text-sm">Save imported successfully!</p>
                </div>

                <!-- Export -->
                <div>
                    <button @click="handleExport"
                        class="w-full px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                        Export Save to Clipboard
                    </button>
                    <p v-if="showExportSuccess" class="text-green-500 mt-2 text-sm">Save copied to clipboard!</p>
                </div>

                <!-- Reset -->
                <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button v-if="!showResetConfirm" @click="showResetConfirm = true"
                        class="w-full px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                        Reset Game
                    </button>
                    <div v-else class="space-y-2">
                        <p class="text-sm text-red-500 dark:text-red-400">Are you sure? This cannot be undone!</p>
                        <div class="flex space-x-2">
                            <button @click="handleReset"
                                class="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                                Yes, Reset
                            </button>
                            <button @click="showResetConfirm = false"
                                class="flex-1 px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notification Toast -->
        <div v-if="showExportSuccess || showImportSuccess"
            class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {{ showExportSuccess ? 'Save copied to clipboard!' : 'Save imported successfully!' }}
        </div>
    </nav>
</template>
