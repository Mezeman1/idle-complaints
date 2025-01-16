<script setup lang="ts">
import { useAchievementStore } from '@/stores/achievement-store'
import { formatNumber } from '@/utils/formatters'

const achievementStore = useAchievementStore()
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navigation />
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h1>

        <!-- Achievement Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Active Bonuses</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">Point Multiplier</div>
              <div class="text-lg font-medium text-blue-500 dark:text-blue-400">
                +{{ formatNumber(achievementStore.getTotalMultiplierBonus) }}x
              </div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">Auto Typing Speed</div>
              <div class="text-lg font-medium text-green-500 dark:text-green-400">
                +{{ formatNumber(achievementStore.getTotalAutoTypingBonus) }} chars/sec
              </div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">Word Assist Speed</div>
              <div class="text-lg font-medium text-purple-500 dark:text-purple-400">
                +{{ formatNumber(achievementStore.getTotalWordAssistSpeedBonus) }}s faster
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="achievement in achievementStore.achievements" :key="achievement.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-200"
            :class="{ 'opacity-50 dark:opacity-40': !achievement.earned }">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ achievement.icon }}</span>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ achievement.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ achievement.description }}
                </p>
              </div>
            </div>

            <div class="mt-2">
              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div class="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }"
                  :class="{
                    'bg-blue-500 dark:bg-blue-400': achievement.bonus.type === 'multiplier',
                    'bg-green-500 dark:bg-green-400': achievement.bonus.type === 'auto_typing',
                    'bg-purple-500 dark:bg-purple-400': achievement.bonus.type === 'word_assist_speed'
                  }">
                </div>
              </div>
              <!-- Progress Text -->
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Progress: {{ formatNumber(Math.min(achievement.progress, achievement.requirement)) }} / {{ formatNumber(achievement.requirement) }}
                ({{ Math.min(Math.floor((achievement.progress / achievement.requirement) * 100), 100) }}%)
              </div>

              <div class="mt-2 text-sm" :class="{
                'text-blue-600 dark:text-blue-400': achievement.bonus.type === 'multiplier',
                'text-green-600 dark:text-green-400': achievement.bonus.type === 'auto_typing',
                'text-purple-600 dark:text-purple-400': achievement.bonus.type === 'word_assist_speed'
              }">
                Bonus: +{{ achievement.bonus.amount }}
                {{ achievement.bonus.type === 'multiplier' ? 'x points' :
                   achievement.bonus.type === 'auto_typing' ? ' chars/sec' :
                   ' word assist speed' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
