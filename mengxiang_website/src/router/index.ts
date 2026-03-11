import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/LoginPage.vue') },
    { path: '/', name: 'home', component: () => import('@/views/Home/MainPage.vue') },
    { path: '/team/message', component: () => import('@/views/Team/Person_Message.vue') },
    { path: '/team/new', component: () => import('@/views/Team/New_Team.vue') },
    { path: '/resource', component: () => import('@/views/TreeDong/TreeDongPage.vue') },
    { path: '/blog', component: () => import('@/views/Blog/BlogPage.vue') },
    { path: '/blog/detail', component: () => import('@/views/Blog/BlogDetail.vue') },
    { path: '/blog/:id', component: () => import('@/views/Blog/BlogSelf.vue') },
    {
      path: '/user',
      component: () => import('@/views/User/UserLayout.vue'),
      redirect: '/user/center',
      children: [
        { path: '/user/center', component: () => import('@/views/User/UserCenter.vue') },
        { path: '/user/tree', component: () => import('@/views/User/UserTreeHole.vue') },
        { path: '/user/blog', component: () => import('@/views/User/UserBlog.vue') },
      ],
    },
  ],
})

export default router
