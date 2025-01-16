<script setup lang="ts">
import { ref } from 'vue'
import { useAchievementStore } from '@/stores/achievement-store'
import { useStore } from '@/store'
import AchievementNotification from '@/components/base/AchievementNotification.vue'
import IndexPage from '@/pages/IndexPage.vue'
import Achievements from '@/views/Achievements.vue'
import Navigation from '@/components/base/Navigation.vue'

const achievementStore = useAchievementStore()
const store = useStore()
const currentTab = ref('game')

store.loadGame()
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">

    <Navigation :current-tab="currentTab" @update:current-tab="currentTab = $event" />

    <div v-show="currentTab === 'game'">
      <IndexPage />
    </div>
    <div v-show="currentTab === 'achievements'">
      <Achievements />
    </div>

    <div class="fixed bottom-0 right-0 z-50 space-y-2 p-4">
      <TransitionGroup name="notification">
        <AchievementNotification v-for="achievement in achievementStore.notifications" :key="achievement.id"
          :name="achievement.name" :icon="achievement.icon" :bonus="achievement.bonus" />
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
button {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}


.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
