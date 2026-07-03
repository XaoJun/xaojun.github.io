<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { marked } from 'marked'
import { getPost } from '../services/api'

const route = useRoute()
const post = ref(null)
const content = ref('')
const loading = ref(true)

const loadPost = async () => {
  try {
    const slug = route.params.slug
    const postDetail = await getPost(slug)
    
    post.value = postDetail
    content.value = marked(postDetail.content || '')
  } catch (err) {
    console.error('加载文章失败:', err)
    post.value = {
      title: '文章未找到',
      date: new Date().toISOString().split('T')[0],
      readTime: '0 分钟',
      category: 'Error',
    }
    content.value = '<p>抱歉，该文章不存在或加载失败。</p>'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载文章中...</p>
    </div>

    <article v-else class="blog-detail">
      <header class="blog-detail-header">
        <span class="tag">{{ post?.category }}</span>
        <h1>{{ post?.title }}</h1>
        <p class="blog-meta">{{ post?.date }} · {{ post?.readTime }}</p>
      </header>

      <div class="blog-detail-content" v-html="content"></div>

      <footer class="blog-detail-footer">
        <RouterLink to="/blog" class="secondary-link">返回博客列表</RouterLink>
      </footer>
    </article>
  </div>
</template>
