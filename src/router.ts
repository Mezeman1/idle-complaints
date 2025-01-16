import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/pages/IndexPage.vue'
import Achievements from '@/views/Achievements.vue'
import App from './App.vue'

export const router = createRouter({
  history: createWebHistory('/idle-complaints/'),
  routes: [
    {
      path: '/',
      name: 'game',
      component: App,
      meta: {
        title: 'Complaint Department',
      },
    },
  ],
})

export default router
