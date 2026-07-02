<script setup>
import { ref } from 'vue'
import { PHOTO_FILE_NAMES, getPhotoDate, getPhotoUrl } from '../data/photos'

const selectedPhoto = ref(null)

const photos = PHOTO_FILE_NAMES.map((fileName, index) => ({
  id: index + 1,
  title: `照片 ${index + 1}`,
  date: getPhotoDate(fileName),
  url: getPhotoUrl(fileName),
}))

const openLightbox = (photo) => {
  selectedPhoto.value = photo
}

const closeLightbox = () => {
  selectedPhoto.value = null
}

</script>

<template>
  <div>
    <section class="photos-header">
      <p class="eyebrow">Daily Photos</p>
      <h1>日常照片</h1>
      <p>记录生活中的美好瞬间，分享一些随手拍的照片。</p>
    </section>

    <section class="photos-grid">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="photo-item"
        @click="openLightbox(photo)"
      >
        <img :src="photo.url" :alt="photo.title" loading="lazy" />
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
          <img :src="selectedPhoto.url" :alt="selectedPhoto.title" />
          <div class="lightbox-info">
            <h3>{{ selectedPhoto.title }}</h3>
            <p>{{ selectedPhoto.date }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
