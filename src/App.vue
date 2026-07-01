<script setup>
const profile = {
  name: '陈',
  title: '一个记录技术、产品与生活的个人博客',
  intro:
    '全栈开发者，长期关注 Vue、TypeScript、工程化与 AI 应用。这里收集我在构建 Web 产品时的经验、踩坑记录和一些可复用的创作提示词。',
  location: 'Guangzhou, China',
  email: 'hello@example.com',
}

const navItems = [
  { label: '首页', href: '#home' },
  { label: '博客', href: '#posts' },
  { label: '提示词', href: '#prompts' },
  { label: '关于', href: '#about' },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: '掘金', href: 'https://juejin.cn/' },
  { label: 'Email', href: `mailto:${profile.email}` },
]

const posts = [
  {
    title: 'Vue3 个人博客从 0 到 1 的搭建笔记',
    date: '6月18日',
    readTime: '8 分钟',
    category: 'Vue',
    summary: '记录路由、组件拆分、文章数据组织、响应式布局和部署流程中的关键取舍。',
  },
  {
    title: '如何设计一个轻量但舒服的阅读页面',
    date: '6月12日',
    readTime: '6 分钟',
    category: 'Design',
    summary: '从字号、行高、留白、卡片层级和暗色模式几个角度，优化博客阅读体验。',
  },
  {
    title: '用 AI 辅助整理技术文章选题',
    date: '5月30日',
    readTime: '5 分钟',
    category: 'AI',
    summary: '把零散想法转换成可执行的文章大纲，并沉淀成长期可复用的工作流。',
  },
]

const prompts = [
  { title: '技术文章结构化大纲生成器', type: 'Writing' },
  { title: '代码评审风险清单', type: 'Coding' },
  { title: '产品需求澄清助手', type: 'Product' },
  { title: '社交媒体摘要改写器', type: 'Text' },
]

const stats = [
  { value: '36+', label: '技术文章' },
  { value: '12', label: '开源片段' },
  { value: '5y', label: '开发经验' },
]
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#home" aria-label="返回首页">
        <span class="brand-mark">{{ profile.name }}</span>
        <span>个人博客</span>
      </a>

      <nav class="nav-links" aria-label="主导航">
        <a v-for="item in navItems" :key="item.label" :href="item.href">{{ item.label }}</a>
      </nav>
    </header>

    <main id="home">
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">{{ profile.location }}</p>
          <h1>{{ profile.title }}</h1>
          <p class="hero-intro">{{ profile.intro }}</p>

          <div class="hero-actions">
            <a class="primary-link" href="#posts">阅读最新文章</a>
            <a class="secondary-link" :href="`mailto:${profile.email}`">联系我</a>
          </div>
        </div>

        <aside class="profile-card" aria-label="个人信息卡片">
          <div class="avatar">{{ profile.name }}</div>
          <h2>在这里找到我</h2>
          <div class="social-list">
            <a v-for="social in socials" :key="social.label" :href="social.href" target="_blank">
              {{ social.label }}
            </a>
          </div>
        </aside>
      </section>

      <section class="stats-grid" aria-label="博客数据">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </section>

      <section id="posts" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">Latest Posts</p>
          <h2>最新文章</h2>
        </div>

        <div class="post-list">
          <article v-for="post in posts" :key="post.title" class="post-card">
            <div>
              <span class="tag">{{ post.category }}</span>
              <h3>
                <a href="#">{{ post.title }}</a>
              </h3>
              <p>{{ post.summary }}</p>
            </div>
            <footer>{{ post.date }} · {{ post.readTime }}</footer>
          </article>
        </div>
      </section>

      <section id="prompts" class="content-section split-section">
        <div class="section-heading">
          <p class="eyebrow">Prompts</p>
          <h2>最新提示词</h2>
          <p>沉淀日常开发、写作和产品思考中高频使用的 AI 工作流。</p>
        </div>

        <div class="prompt-list">
          <a v-for="prompt in prompts" :key="prompt.title" class="prompt-item" href="#">
            <span>{{ prompt.title }}</span>
            <small>{{ prompt.type }}</small>
          </a>
        </div>
      </section>

      <section id="about" class="about-section">
        <p class="eyebrow">About</p>
        <h2>关于这个博客</h2>
        <p>
          这个站点参考了简洁型个人博客的内容组织方式，用更聚焦的首页承载介绍、文章入口和提示词集合。
          你可以直接修改 <code>src/App.vue</code> 中的数据，替换成自己的文章、链接和个人介绍。
        </p>
      </section>
    </main>
  </div>
</template>
