<script setup lang="ts">
import { useStore } from '@/store'
import { Decimal } from 'break_infinity.js'

const store = useStore()

function formatScore(score: Decimal): string {
    return score.toString()
}
</script>

<template>
    <nav class="bg-white dark:bg-gray-800 shadow-md">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                    Idle Complaints
                </h1>
                <div class="flex items-center space-x-4">
                    <span class="text-gray-800 dark:text-white">Score: {{ formatScore(store.score) }}</span>
                    <button @click="store.toggleDarkMode"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span v-if="store.darkMode" class="text-yellow-500">☀️</span>
                        <span v-else class="text-gray-500">🌙</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>
