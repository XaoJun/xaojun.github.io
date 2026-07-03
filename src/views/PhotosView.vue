<script setup>
import { ref } from 'vue'
import { getPhotos } from '../services/api'

const selectedPhoto = ref(null)
const photos = ref([])
const loading = ref(true)

const loadPhotos = async () => {
  try {
    photos.value = await getPhotos()
  } catch (error) {
    console.error('加载照片失败:', error)
  } finally {
    loading.value = false
  }
}

const openLightbox = (photo) => {
  selectedPhoto.value = photo
}

const closeLightbox = () => {
  selectedPhoto.value = null
}

const fallbackToFullPhoto = (event, fullUrl) => {
  if (event.currentTarget.src !== fullUrl) {
    event.currentTarget.src = fullUrl
    return
  }

  event.currentTarget.closest('.photo-item')?.classList.add('is-photo-error')
}

loadPhotos()
</script>

<template>
  <div>
    <section class="photos-header">
      <p class="eyebrow">Daily Photos</p>
      <h1>日常照片</h1>
      <p>记录生活中的美好瞬间，分享一些随手拍的照片。</p>
    </section>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载照片中...</p>
    </div>

    <section v-else class="photos-grid">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="photo-item"
        @click="openLightbox(photo)"
      >
        <img
          :src="photo.thumbUrl"
          :alt="photo.title"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          width="480"
          height="360"
          @error="fallbackToFullPhoto($event, photo.url)"
        />
        <div class="photo-info">
          <span class="photo-title">{{ photo.title }}</span>
          <span class="photo-date">{{ photo.date }}</span>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="selectedPhoto" class="lightbox-overlay" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <img :src="selectedPhoto.url" :alt="selectedPhoto.title" decoding="async" />
          <div class="lightbox-info">
            <h3>{{ selectedPhoto.title }}</h3>
            <p>{{ selectedPhoto.date }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
