<script setup lang="ts">
import { useCollectionStore } from '@/stores/collection-store'
import { complaints } from '@/data/complaints'
import { formatNumber } from '@/utils/formatters'

const collectionStore = useCollectionStore()

function getStarEmoji(stars: number): string {
    return '⭐'.repeat(stars) || '☆'
}

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString()
}

function getHiddenText(text: string): string {
    const maxLength = 35
    if (text.length <= maxLength) {
        return '█'.repeat(text.length)
    }
    return '█'.repeat(maxLength) + '\n' + '█'.repeat(Math.min(text.length - maxLength, maxLength))
}
</script>

<template>
    <div class="min-h-screen bg-theme">
        <div class="container mx-auto px-4 py-8">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-theme mb-4">Complaint Collection</h1>

                <!-- Instructions Card -->
                <div class="card-theme rounded-lg shadow-lg p-4 mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">How to Collect</h2>
                    <div class="prose dark:prose-invert max-w-none">
                        <ul class="text-sm text-gray-600 dark:text-gray-300 list-disc pl-4 space-y-2">
                            <li>Type complaints manually to add them to your collection</li>
                            <li>Using Word Assist won't collect the complaint</li>
                            <li>Get stars based on your typing performance:
                                <ul class="list-none pl-4 mt-1">
                                    <li>⭐ - 95% accuracy</li>
                                    <li>⭐⭐ - 5+ characters per second</li>
                                    <li>⭐⭐⭐ - 98% accuracy and 8+ characters per second</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Collection Stats -->
                <div class="card-theme rounded-lg shadow-lg p-4 mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Collection Progress</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-sm text-gray-500 dark:text-gray-400">Complaints Collected</div>
                            <div class="text-lg font-medium text-blue-500 dark:text-blue-400">
                                {{ collectionStore.totalCollected }} / {{ collectionStore.totalPossible }}
                            </div>
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-sm text-gray-500 dark:text-gray-400">Collection Progress</div>
                            <div class="text-lg font-medium text-green-500 dark:text-green-400">
                                {{ Math.floor(collectionStore.collectionProgress) }}%
                            </div>
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-sm text-gray-500 dark:text-gray-400">Perfect Complaints (⭐⭐⭐)</div>
                            <div class="text-lg font-medium text-yellow-500 dark:text-yellow-400">
                                {{ Object.values(collectionStore.collectedComplaints).filter(c => c.stars === 3).length
                                }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Complaint Collection Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="complaint in complaints" :key="complaint.id"
                        class="card-theme rounded-lg shadow-lg p-4 transition-all duration-200"
                        :class="{ 'opacity-80': !collectionStore.getComplaintStats(complaint.id) }">
                        <div class="flex flex-col space-y-2">
                            <p class="text-gray-900 dark:text-white font-medium"
                                :class="{ 'font-mono': !collectionStore.getComplaintStats(complaint.id) }">
                                {{ collectionStore.getComplaintStats(complaint.id) ? complaint.text :
                                    getHiddenText(complaint.text) }}
                            </p>

                            <div v-if="collectionStore.getComplaintStats(complaint.id)"
                                class="text-sm text-gray-600 dark:text-gray-400">
                                <div class="flex justify-between items-center">
                                    <span>Rating: {{ getStarEmoji(collectionStore.getComplaintStats(complaint.id)?.stars
                                        || 0) }}</span>
                                    <span>Times Typed: {{ collectionStore.getComplaintStats(complaint.id)?.timesTyped
                                        }}</span>
                                </div>
                                <div class="flex justify-between items-center mt-1">
                                    <span>Best Accuracy: {{
                                        Math.floor(collectionStore.getComplaintStats(complaint.id)?.bestAccuracy || 0)
                                        }}%</span>
                                    <span>Best Speed: {{
                                        Math.floor(collectionStore.getComplaintStats(complaint.id)?.bestSpeed || 0) }}
                                        c/s</span>
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Last typed: {{ formatDate(collectionStore.getComplaintStats(complaint.id)?.lastTyped
                                        || 0) }}
                                </div>
                            </div>
                            <div v-else
                                class="text-sm text-gray-500 dark:text-gray-400 italic flex items-center justify-between">
                                <span>Not collected yet</span>
                                <span class="text-xs">Type to unlock</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
