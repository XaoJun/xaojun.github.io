<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getSocialContact, getProfile } from '../services/api'

const route = useRoute()
const contact = ref({
  type: '',
  label: '',
  account: '',
  displayValue: '',
  href: '',
  images: [],
})
const profile = ref({ name: '', intro: '' })
const loading = ref(true)
const errorMessage = ref('')

const pageTitle = computed(() => {
  if (!contact.value.label) {
    return '联系方式'
  }

  return `${contact.value.label} 联系方式`
})

const loadContact = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const [detail, prof] = await Promise.all([
      getSocialContact(route.params.type),
      getProfile().catch(() => ({ name: '', intro: '' })),
    ])
    contact.value = detail
    profile.value = prof
  } catch (error) {
    console.error('加载联系方式失败:', error)
    errorMessage.value = '联系方式加载失败，请稍后再试。'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.type, loadContact, { immediate: true })
</script>

<template>
  <section class="contact-page">
    <RouterLink class="back-link" to="/">返回首页</RouterLink>

    <div class="contact-hero">
      <p class="eyebrow">Contact</p>
      <h1>{{ pageTitle }}</h1>
      <p v-if="profile.name">Hi，我是 {{ profile.name }}，以下是联系方式详情。</p>
      <p v-else>这里展示账号信息和扫码添加好友的二维码。</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载联系方式中...</p>
    </div>

    <div v-else-if="errorMessage" class="empty-state">
      {{ errorMessage }}
    </div>

    <div v-else class="contact-card">
      <div class="contact-account">
        <span>{{ contact.label }} 账号</span>
        <strong>{{ contact.account }}</strong>
        <span v-if="contact.href" class="contact-href">{{ contact.href }}</span>
      </div>

      <div v-if="contact.images.length" class="contact-qrcode-grid">
        <figure v-for="image in contact.images" :key="image.url" class="contact-qrcode-card">
          <img :src="image.url" :alt="image.title" loading="lazy" />
          <figcaption>
            <strong>{{ image.title }}</strong>
            <span>{{ image.description }}</span>
          </figcaption>
        </figure>
      </div>

      <div v-else class="empty-state">
        暂未配置二维码图片，请通知站长尽快补充。
      </div>
    </div>
  </section>
</template>
