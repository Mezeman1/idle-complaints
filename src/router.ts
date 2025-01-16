import { createRouter, createWebHistory } from 'vue-router'

import IndexPage from '@/pages/IndexPage.vue'

const routes = [
  {
    path: '/idle-complaint',
    component: IndexPage,
    meta: {
      title: 'Complaint Department',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: IndexPage,
    meta: {
      title: 'Complaint Department',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
