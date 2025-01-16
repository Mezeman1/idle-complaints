<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const importString = ref('')
const showImportError = ref(false)
const showImportSuccess = ref(false)
const showExportSuccess = ref(false)

function handleImport() {
    try {
        store.importSave(importString.value)
        showImportError.value = false
        showImportSuccess.value = true
        importString.value = ''
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
    setTimeout(() => {
        showExportSuccess.value = false
    }, 3000)
}

// Auto-save every minute
setInterval(() => {
    store.saveGame()
}, 60000)

// Save before closing/refreshing
window.addEventListener('beforeunload', () => {
    store.saveGame()
})
</script>

<template>
    <div class="mt-8 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Save Management</h2>

        <div class="space-y-4">
            <!-- Import -->
            <div>
                <label class="block text-gray-700 dark:text-gray-300 mb-2">Import Save:</label>
                <div class="flex space-x-2">
                    <input v-model="importString" type="text"
                        class="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Paste save string here...">
                    <button @click="handleImport"
                        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Import
                    </button>
                </div>
                <p v-if="showImportError" class="text-red-500 mt-2">Invalid save data</p>
                <p v-if="showImportSuccess" class="text-green-500 mt-2">Save imported successfully!</p>
            </div>

            <!-- Export -->
            <div>
                <button @click="handleExport" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Export Save to Clipboard
                </button>
                <p v-if="showExportSuccess" class="text-green-500 mt-2">Save copied to clipboard!</p>
            </div>
        </div>
    </div>
</template>
