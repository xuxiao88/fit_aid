import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/bmi',
    },
    {
      path: '/bmi',
      name: 'BMI',
      component: () => import('../health/bmi.vue'),
    },
  ],
})

export default router
