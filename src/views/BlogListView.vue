<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getPosts } from '../services/api'

const posts = ref([])
const loading = ref(true)

const loadPosts = async () => {
  try {
    posts.value = await getPosts()
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
