import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/photos',
      name: 'photos',
      component: () => import('../views/PhotosView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogListView.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ResumeView.vue'),
    },
    {
      path: '/contact/:type',
      name: 'contact-detail',
      component: () => import('../views/ContactDetailView.vue'),
    },
  ],
})

export default router
