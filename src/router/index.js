import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/LoginPage.vue') },
  { path: '/countries', component: () => import('../views/CountryList.vue') },
  { path: '/countries/:id', component: () => import('../views/CountryDetail.vue') }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;