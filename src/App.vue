<script setup>
import { RouterLink, RouterView } from 'vue-router'

const profile = {
  name: '田艳军',
}

const navItems = [
  { label: '首页', name: 'home' },
  { label: '日常照片', name: 'photos' },
  { label: '技术博客', name: 'blog' },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: '掘金', href: 'https://juejin.cn/' },
]
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="返回首页">
        <span class="brand-mark" style="background: linear-gradient(135deg, #4A6FA5 0%, #6B8EC8 50%, #8BAADB 100%);">田</span>
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