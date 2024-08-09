import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterView from '../views/CharacterView.vue'
import CharacterDetail from '@/components/CharacterDetail.vue'
import ComicsView from '../views/ComicsView.vue'
import ComicDetail from '@/components/ComicDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component:
    HomeView
  },
  {
    path: '/characters',
    name: 'character',
    component: CharacterView
  },
  {
    path: '/characters/:id',
    name: 'CharacterDetail',
    component: CharacterDetail,
    props: true // позволяет передавать параметры как пропсы
  },
  {
    path: '/comics',
    name: 'comics',
    component: ComicsView
  },
  {
    path: '/comic/:id',
    name: 'ComicDetail',
    component: ComicDetail,
    props: true // позволяет передавать параметры как пропсы
  }
]

const router = createRouter({
  history: createWebHistory('marvel-characters-and-comics'),
  routes
})

export default router
