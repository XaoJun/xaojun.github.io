<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PHOTO_FILE_NAMES, getPhotoUrl } from '../data/photos'

const profile = {
  name: '田艳军',
  title: '后端开发工程师',
  intro: '全栈开发者，长期关注 Spring Boot、微服务架构、Redis 缓存、数据库优化等后端技术。分享技术实践、架构设计和日常思考。',
  location: 'Beijing, China',
  email: 'tianyanjun@example.com',
  avatar: '',
}

const photoSizeClasses = [
  'is-large',
  'is-wide',
  'is-tall',
  'is-small',
  'is-vertical',
  'is-tall',
  'is-large',
  'is-vertical',
  'is-wide',
  'is-medium',
  'is-tall',
  'is-wide',
]

const photoWallRows = [0, 1].map((rowIndex) =>
  PHOTO_FILE_NAMES.map((fileName, index) => ({
    id: `${rowIndex}-${fileName}`,
    url: getPhotoUrl(fileName),
    alt: `生活照片 ${index + 1}`,
    sizeClass: photoSizeClasses[index % photoSizeClasses.length],
  })),
)

const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: '掘金', href: 'https://juejin.cn/' },
  { label: 'Email', href: `mailto:${profile.email}` },
]

const stats = [
  { value: '36', label: '技术文章', href: '/blog' },
  { value: '128', label: '日常照片', href: '/photos' },
  { value: '1.2k', label: '关注者', href: '#' },
]

const activeTab = ref('posts')

const tabs = [
  { label: '最新文章', key: 'posts' },
  { label: '关于我', key: 'about' },
]

const posts = [
  {
    title: 'Spring Boot 微服务架构实践',
    date: '2024-06-18',
    readTime: '12 分钟',
    category: 'Backend',
    summary: '探讨 Spring Boot 在微服务架构中的最佳实践，包括服务拆分、负载均衡和容错处理。',
    slug: 'springboot-microservices',
  },
  {
    title: 'Redis 缓存策略与性能优化',
    date: '2024-06-12',
    readTime: '10 分钟',
    category: 'Database',
    summary: '深入分析 Redis 缓存的设计模式，包括缓存击穿、雪崩和穿透问题的解决方案。',
    slug: 'redis-cache-optimization',
  },
  {
    title: 'Vue3 个人博客从 0 到 1 的搭建笔记',
    date: '2024-05-30',
    readTime: '8 分钟',
    category: 'Vue',
    summary: '记录路由、组件拆分、文章数据组织、响应式布局和部署流程中的关键取舍。',
    slug: 'vue3-blog-setup',
  },
]
</script>

<template>
  <div>
    <div class="profile-cover">
      <div class="photo-wall-track">
        <div
          v-for="(row, rowIndex) in photoWallRows"
          :key="rowIndex"
          class="photo-wall-group"
          :aria-hidden="rowIndex === 1"
        >
          <figure
            v-for="photo in row"
            :key="photo.id"
            :class="['photo-wall-item', photo.sizeClass]"
          >
            <img :src="photo.url" :alt="photo.alt" loading="eager" decoding="async" />
          </figure>
        </div>
      </div>
    </div>
    
    <section class="profile-section">
      <div class="profile-avatar-wrapper">
        <img 
          :src="profile.avatar" 
          :alt="profile.name" 
          class="profile-avatar"
        />
        <div class="profile-avatar-fallback">{{ profile.name.charAt(0) }}</div>
      </div>
      
      <h1 class="profile-name">{{ profile.name }}</h1>
      <p class="profile-title">{{ profile.title }}</p>
      <p class="profile-intro">{{ profile.intro }}</p>
      
      <div class="profile-meta">
        <span class="profile-location">{{ profile.location }}</span>
        <div class="profile-socials">
          <a v-for="social in socials" :key="social.label" :href="social.href" target="_blank">
            {{ social.label }}
          </a>
        </div>
      </div>
    </section>
    
    <div class="profile-stats">
      <a v-for="stat in stats" :key="stat.label" :href="stat.href" class="stat-item">
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </a>
    </div>
    
    <nav class="profile-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>
    
    <section v-if="activeTab === 'posts'" class="content-section">
      <div class="post-list">
        <article v-for="post in posts" :key="post.title" class="post-card">
          <span class="tag">{{ post.category }}</span>
          <h3>
            <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
          </h3>
          <p>{{ post.summary }}</p>
          <footer>{{ post.date }} · {{ post.readTime }}</footer>
        </article>
      </div>
    </section>
    
    <section v-else class="about-section">
      <div class="about-content">
        <h2>关于我</h2>
        <div class="about-grid">
          <div class="about-item">
            <h3>工作经历</h3>
            <ul>
              <li>后端开发工程师，3年+经验</li>
              <li>专注于微服务架构设计</li>
              <li>精通 Spring Boot、Redis、MySQL</li>
            </ul>
          </div>
          <div class="about-item">
            <h3>技术栈</h3>
            <ul>
              <li>Java / Spring Boot</li>
              <li>Redis / MySQL / MongoDB</li>
              <li>Vue.js / React</li>
              <li>Docker / Kubernetes</li>
            </ul>
          </div>
          <div class="about-item">
            <h3>兴趣爱好</h3>
            <ul>
              <li>摄影 / 旅行</li>
              <li>阅读 / 写作</li>
              <li>开源贡献</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
