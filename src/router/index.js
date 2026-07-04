import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '田艳军 | 个人博客 - 技术实践与生活片段' },
    },
    {
      path: '/photos',
      name: 'photos',
      component: () => import('../views/PhotosView.vue'),
      meta: { title: '日常照片 | 田艳军的个人博客' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogListView.vue'),
      meta: { title: '技术博客 | 田艳军的个人博客' },
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
      meta: { title: '文章详情 | 田艳军的个人博客' },
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/ResumeView.vue'),
      meta: { title: '个人简历 | 田艳军的个人博客' },
    },
    {
      path: '/contact/:type',
      name: 'contact-detail',
      component: () => import('../views/ContactDetailView.vue'),
      meta: { title: '联系方式 | 田艳军的个人博客' },
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title || '田艳军 | 个人博客'
})

export default router
