<script setup lang="ts">
import { useThemeStore } from '@/stores/theme-store'
import { useStore } from '@/store'
import { formatNumber } from '@/utils/formatters'

const themeStore = useThemeStore()
const store = useStore()

function purchaseTheme(themeId: string) {
    const theme = themeStore.themes[themeId]
    if (store.score.gte(theme.cost)) {
        store.score = store.score.minus(theme.cost)
        themeStore.unlockTheme(themeId)
        themeStore.setTheme(themeId)
    }
}

const colorNames = {
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    background: 'Background',
    text: 'Text',
    card: 'Card',
    border: 'Border',
}
</script>

<template>
    <div class="min-h-screen bg-theme">
        <div class="container mx-auto px-4 py-8">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-theme mb-4">Theme Shop</h1>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="theme in themeStore.themes" :key="theme.id" class="card-theme rounded-lg shadow-lg p-4">
                        <div class="flex flex-col space-y-3">
                            <h3 class="text-lg font-semibold text-theme">
                                {{ theme.name }}
                            </h3>
                            <p class="text-sm text-theme opacity-80">
                                {{ theme.description }}
                            </p>

                            <!-- Color Preview -->
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <div class="text-sm font-medium mb-2 text-theme">Light Mode</div>
                                    <div class="space-y-1">
                                        <div v-for="(color, name) in theme.colors.light" :key="name"
                                            class="flex items-center space-x-2 text-xs">
                                            <div class="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700"
                                                :style="{ backgroundColor: color }">
                                            </div>
                                            <span class="text-theme">{{ colorNames[name] }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-sm font-medium mb-2 text-theme">Dark Mode</div>
                                    <div class="space-y-1">
                                        <div v-for="(color, name) in theme.colors.dark" :key="name"
                                            class="flex items-center space-x-2 text-xs">
                                            <div class="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700"
                                                :style="{ backgroundColor: color }">
                                            </div>
                                            <span class="text-theme">{{ colorNames[name] }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span v-if="theme.cost > 0" class="text-sm text-theme opacity-80">
                                    Cost: {{ formatNumber(theme.cost) }} points
                                </span>
                                <span v-else class="text-sm text-theme opacity-80">
                                    Free
                                </span>

                                <button v-if="!themeStore.unlockedThemes.includes(theme.id)"
                                    @click="purchaseTheme(theme.id)"
                                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    :disabled="store.score.lt(theme.cost)">
                                    Purchase
                                </button>
                                <button v-else @click="themeStore.setTheme(theme.id)" :class="{
                                    'btn-primary': themeStore.currentTheme === theme.id,
                                    'btn-secondary': themeStore.currentTheme !== theme.id
                                }">
                                    {{ themeStore.currentTheme === theme.id ? 'Active' : 'Apply' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
