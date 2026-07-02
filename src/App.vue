<script setup>
import { RouterLink, RouterView } from 'vue-router'

const navItems = [
  { label: '首页', name: 'home' },
  { label: '日常照片', name: 'photos' },
  { label: '博客', name: 'blog' },
  { label: '简历', name: 'resume' },
]
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="返回首页">
        <span class="brand-mark">TYJ</span>
        <span>个人博客</span>
      </RouterLink>

      <nav class="nav-links" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          active-class="active"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
