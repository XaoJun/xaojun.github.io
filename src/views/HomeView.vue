<script setup>
import { RouterLink } from 'vue-router'
import { PHOTO_FILE_NAMES, getPhotoThumbUrl, getPhotoUrl } from '../data/photos'

const profile = {
  name: '田艳军',
  gender: '男',
  title: '后端开发工程师',
  intro: '关注 Spring Boot、微服务架构、Redis 缓存、数据库优化，也会记录生活照片和阶段性的成长复盘。',
  location: 'Beijing, China',
  email: 'tianyanjun@example.com',
  qq: '123456789',
  wechat: 'your-wechat-id',
}

const profileFacts = [
  { label: '当前身份', value: profile.title },
  { label: '内容方向', value: '后端开发 / 架构设计 / 生活记录' },
  { label: '常用技术', value: 'Spring Boot / Redis / MySQL / Vue' },
]

const photoSizeClasses = ['is-large', 'is-wide', 'is-tall', 'is-small', 'is-vertical', 'is-medium']

const photoWallRows = [0, 1].map((rowIndex) =>
  PHOTO_FILE_NAMES.map((fileName, index) => ({
    id: `${rowIndex}-${fileName}`,
    url: getPhotoThumbUrl(fileName),
    fullUrl: getPhotoUrl(fileName),
    alt: `生活照片 ${index + 1}`,
    sizeClass: photoSizeClasses[index % photoSizeClasses.length],
    loading: rowIndex === 0 && index < 4 ? 'eager' : 'lazy',
    fetchPriority: rowIndex === 0 && index < 2 ? 'high' : 'low',
  })),
)

const fallbackToFullPhoto = (event, fullUrl) => {
  if (event.currentTarget.src !== fullUrl) {
    event.currentTarget.src = fullUrl
    return
  }

  event.currentTarget.closest('.photo-wall-item')?.classList.add('is-photo-error')
}

const socials = [
  { label: 'GitHub', icon: 'github', href: 'https://github.com/' },
  { label: 'QQ', icon: 'qq', href: `tencent://message/?uin=${profile.qq}` },
  { label: '微信', icon: 'wechat', href: '#wechat' },
  { label: 'Email', href: `mailto:${profile.email}` },
]

const stats = [
  { value: '36', label: '技术文章' },
  { value: '128', label: '生活照片' },
  { value: '3+', label: '开发经验' },
]

const musicControls = [
  { label: '上一首', symbol: '‹‹' },
  { label: '暂停/播放', symbol: 'Ⅱ' },
  { label: '下一首', symbol: '››' },
]

const panelNavItems = [
  { label: '首页', to: '/' },
  { label: '日常照片', to: '/photos' },
  { label: '博客', to: '/blog' },
  { label: '简历', to: '/resume' },
]

const siteCards = [
  {
    title: '日常照片',
    desc: '把旅途、城市和随手拍整理成一条生活时间线。',
    to: '/photos',
  },
  {
    title: '技术博客',
    desc: '记录后端、架构、缓存、数据库和个人项目实践。',
    to: '/blog',
  },
  {
    title: '个人简历',
    desc: '集中展示工作经历、技术栈、项目经验和联系方式。',
    to: '/resume',
  },
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

const blogInfo = [
  '后端工程实践',
  '系统架构设计',
  '数据库与缓存优化',
  '个人成长记录',
]
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="hero-visual" aria-label="流动照片背景">
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
              <img
                :src="photo.url"
                :alt="photo.alt"
                :loading="photo.loading"
                :fetchpriority="photo.fetchPriority"
                decoding="async"
                width="480"
                height="320"
                @error="fallbackToFullPhoto($event, photo.fullUrl)"
              />
            </figure>
          </div>
        </div>
      </div>

      <aside class="hero-profile-panel">
        <div class="hero-panel-side">
          <div class="music-widget">
            <button class="music-play-button" type="button" aria-label="播放音乐">
              <span>♪</span>
            </button>
            <div class="music-copy">
              <strong>正在播放</strong>
              <span>生活与代码的背景音乐</span>
            </div>
            <div class="music-controls" aria-label="音乐切换按钮">
              <button
                v-for="control in musicControls"
                :key="control.label"
                type="button"
                :aria-label="control.label"
              >
                {{ control.symbol }}
              </button>
            </div>
          </div>

          <div class="profile-stats">
            <div v-for="stat in stats" :key="stat.label" class="stat-item">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>

          <nav class="panel-nav" aria-label="面板导航">
            <RouterLink
              v-for="item in panelNavItems"
              :key="item.label"
              :to="item.to"
            >
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="profile-socials" aria-label="社交链接">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :title="social.label"
              target="_blank"
              rel="noreferrer"
            >
              <svg v-if="social.icon === 'github'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.86 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.91c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.96c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92v2.81c0 .27.18.59.69.49A10.15 10.15 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
              </svg>
              <svg v-else-if="social.icon === 'qq'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.2c-2.84 0-5.16 2.53-5.16 6.02 0 1.33.33 2.8.9 4.13-.8.62-1.34 1.51-1.34 2.51 0 .52.15 1.03.43 1.47-.9.68-1.49 1.56-1.49 2.36 0 .91.79 1.28 1.78.84.52.93 1.73 1.56 3.11 1.56.66 0 1.28-.14 1.77-.4.5.26 1.11.4 1.77.4 1.38 0 2.59-.63 3.11-1.56.99.44 1.78.07 1.78-.84 0-.8-.59-1.68-1.49-2.36.28-.44.43-.95.43-1.47 0-1-.54-1.89-1.34-2.51.57-1.33.9-2.8.9-4.13 0-3.49-2.32-6.02-5.16-6.02Zm-2.03 7.6c-.46 0-.83-.48-.83-1.07s.37-1.07.83-1.07.84.48.84 1.07-.38 1.07-.84 1.07Zm4.06 0c-.46 0-.84-.48-.84-1.07s.38-1.07.84-1.07.83.48.83 1.07-.37 1.07-.83 1.07Z" />
              </svg>
              <svg v-else-if="social.icon === 'wechat'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.2 4.2c-4 0-7.2 2.55-7.2 5.7 0 1.82 1.08 3.44 2.76 4.48l-.58 1.86 2.26-1.09c.86.29 1.79.45 2.76.45.18 0 .36 0 .54-.02a5.66 5.66 0 0 1-.28-1.75c0-3.06 2.94-5.54 6.56-5.54.1 0 .2 0 .3.01-.82-2.39-3.65-4.1-7.12-4.1Zm-2.36 4.9a.86.86 0 1 1 0-1.72.86.86 0 0 1 0 1.72Zm4.7 0a.86.86 0 1 1 0-1.72.86.86 0 0 1 0 1.72Zm4.48.7c-3.02 0-5.48 1.95-5.48 4.36s2.46 4.36 5.48 4.36c.75 0 1.46-.12 2.11-.34l1.72.84-.44-1.43C20.7 16.8 21.5 15.56 21.5 14.16c0-2.41-2.46-4.36-5.48-4.36Zm-1.78 3.32a.67.67 0 1 1 0-1.34.67.67 0 0 1 0 1.34Zm3.57 0a.67.67 0 1 1 0-1.34.67.67 0 0 1 0 1.34Z" />
              </svg>
              <span v-else>@</span>
            </a>
          </div>
        </div>

        <div class="hero-panel-main">
          <div class="hero-profile-avatar">{{ profile.name.charAt(0) }}</div>
          <h1>{{ profile.name }}</h1>

          <div class="hero-profile-meta">
            <span>性别：{{ profile.gender }}</span>
            <span>归属地：{{ profile.location }}</span>
          </div>

          <div class="profile-facts">
            <div v-for="fact in profileFacts" :key="fact.label" class="profile-fact">
              <span>{{ fact.label }}</span>
              <strong>{{ fact.value }}</strong>
            </div>
          </div>
        </div>

        <div class="hero-intro-card">
          <span>个人介绍</span>
          <p>{{ profile.intro }}</p>
          <small>邮箱：{{ profile.email }}</small>
        </div>
      </aside>
    </section>

    <section class="home-section">
      <div>
        <p class="eyebrow">Blog Info</p>
        <h2>这里会记录技术实践，也会保留生活里的即时片段。</h2>
      </div>
      <div class="blog-info-list">
        <span v-for="item in blogInfo" :key="item">{{ item }}</span>
      </div>
    </section>

    <section class="site-card-grid">
      <RouterLink v-for="card in siteCards" :key="card.title" :to="card.to" class="site-card">
        <h3>{{ card.title }}</h3>
        <p>{{ card.desc }}</p>
        <span>进入查看</span>
      </RouterLink>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <p class="eyebrow">Recent Posts</p>
        <h2>最新文章</h2>
      </div>
      <article v-for="post in posts" :key="post.title" class="post-card">
        <span class="tag">{{ post.category }}</span>
        <h3>
          <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
        </h3>
        <p>{{ post.summary }}</p>
        <footer>{{ post.date }} · {{ post.readTime }}</footer>
      </article>
    </section>
  </div>
</template>
