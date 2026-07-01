<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const posts = ref([])
const loading = ref(true)

const loadPosts = async () => {
  try {
    const postList = [
      {
        title: 'Vue3 个人博客从 0 到 1 的搭建笔记',
        date: '2024-06-18',
        readTime: '8 分钟',
        category: 'Vue',
        summary: '记录路由、组件拆分、文章数据组织、响应式布局和部署流程中的关键取舍。',
        slug: 'vue3-blog-setup',
      },
      {
        title: '如何设计一个轻量但舒服的阅读页面',
        date: '2024-06-12',
        readTime: '6 分钟',
        category: 'Design',
        summary: '从字号、行高、留白、卡片层级和暗色模式几个角度，优化博客阅读体验。',
        slug: 'design-reading-page',
      },
      {
        title: '用 AI 辅助整理技术文章选题',
        date: '2024-05-30',
        readTime: '5 分钟',
        category: 'AI',
        summary: '把零散想法转换成可执行的文章大纲，并沉淀成长期可复用的工作流。',
        slug: 'ai-content-ideas',
      },
      {
        title: 'Spring Boot 微服务架构实践',
        date: '2024-05-25',
        readTime: '12 分钟',
        category: 'Backend',
        summary: '探讨 Spring Boot 在微服务架构中的最佳实践，包括服务拆分、负载均衡和容错处理。',
        slug: 'springboot-microservices',
      },
      {
        title: 'Redis 缓存策略与性能优化',
        date: '2024-05-20',
        readTime: '10 分钟',
        category: 'Database',
        summary: '深入分析 Redis 缓存的设计模式，包括缓存击穿、雪崩和穿透问题的解决方案。',
        slug: 'redis-cache-optimization',
      },
    ]

    posts.value = postList.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('加载博客文章失败:', error)
  } finally {
    loading.value = false
  }
}

loadPosts()
</script>

<template>
  <div>
    <section class="blog-header">
      <p class="eyebrow">Technical Blog</p>
      <h1>技术博客</h1>
      <p>分享后端开发、系统架构、数据库优化等技术文章。</p>
    </section>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载文章中...</p>
    </div>

    <div v-else class="post-list">
      <article v-for="post in posts" :key="post.title" class="post-card">
        <div>
          <span class="tag">{{ post.category }}</span>
          <h3>
            <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
          </h3>
          <p>{{ post.summary }}</p>
        </div>
        <footer>{{ post.date }} · {{ post.readTime }}</footer>
      </article>
    </div>
  </div>
</template>