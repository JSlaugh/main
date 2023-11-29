import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BannerView from '../views/BannerView.vue'
import HangmanView from '../views/HangmanView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'banner',
      component: BannerView,
      children: [
        {
          path: '/',
          component: HomeView
        },
        {
          path: '/hangman',
          component: HangmanView
        }
      ]
    }
  ]
})

export default router
