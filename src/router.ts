import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/pages/IndexPage.vue'
import Achievements from '@/views/Achievements.vue'

export const router = createRouter({
  history: createWebHistory('/idle-complaints/'),
  routes: [
    {
      path: '/',
      name: 'game',
      component: IndexPage,
      meta: {
        title: 'Complaint Department',
      },
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: Achievements,
      meta: {
        title: 'Achievements - Complaint Department',
      },
    },
  ],
})

export default router
