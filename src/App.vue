<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const navItems = [
  { label: '首页', name: 'home' },
  { label: '日常照片', name: 'photos' },
  { label: '博客', name: 'blog' },
  { label: '简历', name: 'resume' },
]

const theme = ref('light')

const themeConfig = {
  light: {
    label: '浅色主题',
    shortLabel: '浅',
    accent: '#5B9A6F',
    accentStrong: '#2F6B46',
    background: '#FAF8F5',
    text: '#FFFFFF',
  },
  dark: {
    label: '深色主题',
    shortLabel: '深',
    accent: '#6BB87E',
    accentStrong: '#1F2F24',
    background: '#1F1D1B',
    text: '#F5F1ED',
  },
}

const currentTheme = computed(() => themeConfig[theme.value])
const nextTheme = computed(() => (theme.value === 'dark' ? 'light' : 'dark'))
const themeButtonLabel = computed(() => `切换到 ${themeConfig[nextTheme.value].label}`)

const createNameIcon = ({ accent, accentStrong, background, text }) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="18" fill="${background}"/>
      <circle cx="48" cy="16" r="18" fill="${accent}" opacity="0.22"/>
      <circle cx="16" cy="52" r="22" fill="${accent}" opacity="0.2"/>
      <rect x="10" y="10" width="44" height="44" rx="15" fill="${accent}"/>
      <path d="M18 21h28M18 32h28M18 43h28M25 21v22M39 21v22" stroke="${text}" stroke-width="4" stroke-linecap="round"/>
      <text x="32" y="38" text-anchor="middle" font-size="18" font-weight="800" font-family="Arial, sans-serif" fill="${accentStrong}">YJ</text>
    </svg>
  `

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const updateFavicon = (config) => {
  const iconLink =
    document.querySelector('link[rel="icon"]') ||
    document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }))

  iconLink.setAttribute('type', 'image/svg+xml')
  iconLink.setAttribute('href', createNameIcon(config))

  const themeColor =
    document.querySelector('meta[name="theme-color"]') ||
    document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }))

  themeColor.setAttribute('content', config.background)
}

const applyTheme = (themeName) => {
  const config = themeConfig[themeName]

  document.documentElement.dataset.theme = themeName
  document.documentElement.style.colorScheme = themeName
  updateFavicon(config)
  localStorage.setItem('site-theme', themeName)
}

const toggleTheme = () => {
  theme.value = nextTheme.value
}

onMounted(() => {
  const savedTheme = localStorage.getItem('site-theme')
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  theme.value = Object.prototype.hasOwnProperty.call(themeConfig, savedTheme)
    ? savedTheme
    : preferredTheme
  applyTheme(theme.value)
})

watch(theme, applyTheme)
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="返回首页">
        <span class="brand-mark" aria-hidden="true">
          <span>田</span>
        </span>
        <span class="brand-copy">
          <strong>田艳军</strong>
          <small>个人博客</small>
        </span>
      </RouterLink>

      <div class="header-actions">
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

        <button
          class="theme-toggle"
          type="button"
          :aria-label="themeButtonLabel"
          :title="themeButtonLabel"
          @click="toggleTheme"
        >
          <span class="theme-toggle-icon" aria-hidden="true">{{ currentTheme.shortLabel }}</span>
          <span class="theme-toggle-text">{{ currentTheme.label }}</span>
        </button>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
