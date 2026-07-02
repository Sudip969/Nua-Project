import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailStub from '../views/ProductDetailStub.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetailStub,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
