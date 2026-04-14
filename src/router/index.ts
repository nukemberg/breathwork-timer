import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/training/:id',
    name: 'training-detail',
    component: () => import('@/views/TrainingDetailView.vue'),
  },
  {
    path: '/session',
    name: 'session',
    component: () => import('@/views/SessionView.vue'),
    meta: { hideNav: true },
  },
  {
    path: '/calibration',
    name: 'calibration',
    component: () => import('@/views/CalibrationView.vue'),
  },
  {
    path: '/custom/new',
    name: 'custom-new',
    component: () => import('@/views/CustomTrainingView.vue'),
  },
  {
    path: '/custom/:id/edit',
    name: 'custom-edit',
    component: () => import('@/views/CustomTrainingView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
