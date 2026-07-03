<script setup>
import { ref } from 'vue'
import { getResume } from '../services/api'

const profile = ref({
  name: '',
  intro: '',
  location: '',
  email: '',
  phone: '',
})
const identities = ref([])
const skills = ref([])
const projects = ref([])
const loading = ref(true)

const loadResume = async () => {
  try {
    const resume = await getResume()
    profile.value = resume.profile
    identities.value = resume.identities
    skills.value = resume.skills
    projects.value = resume.projects
  } catch (error) {
    console.error('加载简历失败:', error)
  } finally {
    loading.value = false
  }
}

loadResume()
</script>

<template>
  <section class="resume-page">
    <div class="resume-hero">
      <p class="eyebrow">Resume</p>
      <h1>{{ profile.name }}</h1>
      <p>{{ identities.join(' / ') }}，关注稳定、高性能的业务系统设计与落地。</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载简历中...</p>
    </div>

    <div v-else class="resume-grid">
      <article class="resume-card">
        <h2>个人信息</h2>
        <p>所在地：{{ profile.location }}</p>
        <p>邮箱：{{ profile.email }}</p>
        <p>手机号：{{ profile.phone }}</p>
        <p>开发经验：{{ profile.devExperience }}</p>
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
