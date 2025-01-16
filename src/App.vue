<script setup lang="ts">
// See vite.config.ts for details about automatic imports
const route = useRoute()

useHead({
  title: () => route.meta.title || 'Vite + Vue Template',
  meta: [
    {
      property: 'og:title',
      content: () => route.meta.title,
    },
    {
      name: 'twitter:title',
      content: () => route.meta.title,
    },
  ],
})

import { useAchievementStore } from '@/stores/achievement-store'
import { useStore } from '@/store'
import AchievementNotification from '@/components/base/AchievementNotification.vue'

const achievementStore = useAchievementStore()
const store = useStore()

store.loadGame()
</script>
<template>
  <router-view />
  <div class="fixed bottom-0 right-0 z-50 space-y-2 p-4">
    <TransitionGroup name="notification">
      <AchievementNotification
        v-for="achievement in achievementStore.notifications"
        :key="achievement.id"
        :name="achievement.name"
        :icon="achievement.icon"
        :bonus="achievement.bonus"
      />
    </TransitionGroup>
  </div>
</template>

<style >
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
