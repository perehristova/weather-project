import { createRouter, createWebHistory } from 'vue-router';
import WeatherView from '../views/WeatherView.vue';
import AboutView from '../views/AboutView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: WeatherView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;