import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bmi',
      name: 'BMI',
      component: () => import('../health/bmi.vue'),
    },
  ],
})

export default router
