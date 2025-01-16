<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import { complaints } from '@/data/complaints'
import Decimal from 'break_infinity.js'

const store = useStore()
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
    store.typedText = input
}

function handleSubmit() {
    if (similarity.value >= 90) {
        const points = calculatePoints(store.currentComplaint, similarity.value)
        store.addScore(points)
        getNewComplaint()
        store.typedText = ''
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        handleSubmit()
    }
}

// Initialize with first complaint
if (!store.currentComplaint) {
    getNewComplaint()
}
</script>

<template>
    <div class="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Current Complaint:</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">{{ store.currentComplaint }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Potential points: {{ calculatePoints(store.currentComplaint, 100) }} (at 100% accuracy)
            </p>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2">Type the complaint:</label>
            <input type="text" :value="store.typedText" @input="handleInput" @keydown="handleKeydown"
                class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Start typing...">
        </div>

        <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                <div>Accuracy: {{ Math.round(similarity) }}%</div>
                <div>Points for current accuracy: {{ calculatePoints(store.currentComplaint, similarity) }}</div>
            </div>
            <button @click="handleSubmit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="similarity < 90">
                Submit
            </button>
        </div>
    </div>
</template>
