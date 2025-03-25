import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/LoginPage.vue') },
    { path: '/', name:'home', component: () => import('@/views/Index/MainPage.vue') },
    { path: '/team/message', component: () => import('@/views/Team/Person_Message.vue') },
    { path: '/team/new', component: () => import('@/views/Team/New_Team.vue') },
    { path: '/resource', component: () => import('@/views/Resource/ResourcePage.vue') },
    { path: '/blog', component: () => import('@/views/Blog/BlogPage.vue') }
  ],
})

export default router
