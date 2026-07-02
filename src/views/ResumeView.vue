<script setup>
const skills = ['Java', 'Spring Boot', 'Redis', 'MySQL', 'Vue 3', 'Docker', 'Linux']

const projects = [
  {
    name: '个人博客系统',
    desc: '基于 Vue 3 和 Vite 搭建，包含文章、照片、个人信息和 GitHub Pages 自动部署。',
  },
  {
    name: '微服务业务系统',
    desc: '围绕 Spring Boot、Redis、MySQL 完成接口开发、缓存设计和性能优化。',
  },
]
</script>

<template>
  <section class="resume-page">
    <div class="resume-hero">
      <p class="eyebrow">Resume</p>
      <h1>田艳军</h1>
      <p>后端开发工程师，关注稳定、高性能的业务系统设计与落地。</p>
    </div>

    <div class="resume-grid">
      <article class="resume-card">
        <h2>个人信息</h2>
        <p>所在地：Beijing, China</p>
        <p>邮箱：tianyanjun@example.com</p>
        <p>方向：后端开发 / 微服务 / 数据库优化</p>
      </article>

      <article class="resume-card">
        <h2>技术栈</h2>
        <div class="skill-list">
          <span v-for="skill in skills" :key="skill">{{ skill }}</span>
        </div>
      </article>

      <article class="resume-card resume-card-wide">
        <h2>项目经历</h2>
        <div v-for="project in projects" :key="project.name" class="resume-project">
          <h3>{{ project.name }}</h3>
          <p>{{ project.desc }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
