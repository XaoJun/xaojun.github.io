<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getHome, getLifePhotoStat, getTechnicalArticleStat, getMusicTracks } from '../services/api'

const profile = ref({
  name: '',
  gender: '',
  title: '',
  intro: '',
  location: '',
  email: '',
  qq: '',
  wechat: '',
  phone: '',
  devExperience: '',
  blogViews: 0,
})

const profileFacts = ref([])

const photoRowPatterns = [
  { heightClass: 'is-row-large', spans: [3, 2, 1, 2] },
  { heightClass: 'is-row-medium', spans: [2, 2, 2, 2] },
  { heightClass: 'is-row-tall', spans: [1, 3, 2, 2] },
  { heightClass: 'is-row-medium', spans: [4, 1, 1, 2] },
  { heightClass: 'is-row-large', spans: [2, 3, 1, 2] },
  { heightClass: 'is-row-medium', spans: [1, 2, 2, 3] },
]
const photoWallSegmentCount = 4
const photoWallRowsPerSegment = 16
const isHomeLoading = ref(true)
const showPhotoWall = ref(false)
let isHomeUnmounted = false
let photoWallDelayTask
let photoWallIdleTask

const photoWall = ref([])
const photoWallSegments = computed(() => {
  if (!photoWall.value.length) {
    return []
  }

  return Array.from({ length: photoWallSegmentCount }, (_, segmentIndex) => {
    return Array.from({ length: photoWallRowsPerSegment }, (_, rowIndex) => {
      const pattern = photoRowPatterns[(rowIndex + segmentIndex) % photoRowPatterns.length]

      return {
        id: `${segmentIndex}-${rowIndex}`,
        heightClass: pattern.heightClass,
        photos: pattern.spans.map((span, itemIndex) => {
          const photoIndex = (rowIndex * 4 + itemIndex + segmentIndex * 5) % photoWall.value.length
          const photo = photoWall.value[photoIndex]

          return {
            id: `${segmentIndex}-${rowIndex}-${itemIndex}-${photo.id}`,
            url: photo.thumbUrl,
            fullUrl: photo.url,
            alt: photo.title || `生活照片 ${photoIndex + 1}`,
            spanClass: `is-span-${span}`,
            loading: segmentIndex === 0 && rowIndex < 3 ? 'eager' : 'lazy',
            fetchPriority: segmentIndex === 0 && rowIndex === 0 ? 'high' : 'low',
          }
        }),
      }
    })
  })
})

const preloadPhotoWallImages = async () => {
  const firstSegmentPhotos = photoWallSegments.value[0]?.flatMap((row) => row.photos) || []
  const urls = [...new Set(firstSegmentPhotos.slice(0, 16).map((photo) => photo.url))]

  await Promise.allSettled(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const image = new Image()
          image.onload = resolve
          image.onerror = resolve
          image.src = url

          if (image.decode) {
            image.decode().then(resolve).catch(resolve)
          }
        }),
    ),
  )
}

const socials = ref([])
const internalSocials = computed(() => socials.value.filter((social) => !social.external))
const emailSocials = computed(() => socials.value.filter((social) => social.type === 'email'))
const externalSocials = computed(() =>
  socials.value.filter((social) => social.external && social.type !== 'email'),
)
const activeEmailPopup = ref('')
const emailCopyStatus = ref('')
const stats = ref([])

const musicTracks = ref([])
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioElement = ref(null)

const currentTrack = computed(() => {
  if (!musicTracks.value.length) {
    return null
  }
  return musicTracks.value[currentTrackIndex.value]
})

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) {
    return '00:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!audioElement.value) {
    console.error('音频元素未初始化')
    return
  }

  if (!currentTrack.value) {
    console.error('没有可播放的音乐')
    return
  }

  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    if (!audioElement.value.src || audioElement.value.src !== currentTrack.value.url) {
      audioElement.value.src = currentTrack.value.url
      audioElement.value.load()
    }
    audioElement.value.play().catch((error) => {
      console.error('播放失败:', error)
    })
  }
}

const playNext = () => {
  if (musicTracks.value.length === 0) {
    return
  }
  currentTrackIndex.value = (currentTrackIndex.value + 1) % musicTracks.value.length
  playCurrentTrack()
}

const playPrev = () => {
  if (musicTracks.value.length === 0) {
    return
  }
  currentTrackIndex.value = (currentTrackIndex.value - 1 + musicTracks.value.length) % musicTracks.value.length
  playCurrentTrack()
}

const playCurrentTrack = () => {
  if (!audioElement.value) {
    console.error('音频元素未初始化')
    return
  }

  if (!currentTrack.value) {
    console.error('没有可播放的音乐')
    return
  }

  audioElement.value.src = currentTrack.value.url
  audioElement.value.load()
  audioElement.value.play().catch((error) => {
    console.error('播放失败:', error)
  })
}

const handleTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const handleLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration || currentTrack.value?.duration || 0
  }
}

const handleAudioError = (event) => {
  console.error('音频加载错误:', event)
  console.error('错误信息:', audioElement.value?.error?.message)
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  playNext()
}

const loadMusic = async () => {
  try {
    const tracks = await getMusicTracks()
    musicTracks.value = tracks
    console.log('音乐列表加载成功，共', tracks.length, '首')
    if (tracks.length > 0) {
      console.log('第一首歌:', tracks[0])
    }
  } catch (error) {
    console.error('加载音乐列表失败:', error)
  }
}

const toggleEmailPopup = (type) => {
  activeEmailPopup.value = activeEmailPopup.value === type ? '' : type
  emailCopyStatus.value = ''
}

const copyEmail = async (email) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = email
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    emailCopyStatus.value = '已复制'
  } catch (error) {
    console.error('复制邮箱失败:', error)
    emailCopyStatus.value = '复制失败'
  }
}

const fallbackToFullPhoto = (event, fullUrl) => {
  if (event.currentTarget.src !== fullUrl) {
    event.currentTarget.src = fullUrl
    return
  }

  event.currentTarget.closest('.photo-wall-item')?.classList.add('is-photo-error')
}

const loadHome = async () => {
  isHomeLoading.value = true
  showPhotoWall.value = false

  try {
    const [home, articleStat, photoStat] = await Promise.all([
      getHome(),
      getTechnicalArticleStat(),
      getLifePhotoStat(),
    ])

    profile.value = home.profile
    profileFacts.value = home.profileFacts
    socials.value = home.socials
    stats.value = [
      { label: articleStat.label, value: articleStat.value },
      { label: photoStat.label, value: photoStat.value },
      { label: '开发经验', value: home.profile.devExperience },
      { label: '博客浏览量', value: String(home.profile.blogViews || 0) },
    ]
    panelNavItems.value = home.panelNavItems
    siteCards.value = home.siteCards
    posts.value = home.recentPosts
    blogInfo.value = home.blogInfo
    photoWall.value = home.photoWall

    await loadMusic()
  } catch (error) {
    console.error('加载首页数据失败:', error)
  } finally {
    isHomeLoading.value = false
  }
}

const schedulePhotoWall = () => {
  const renderPhotoWall = async () => {
    await preloadPhotoWallImages()

    if (isHomeUnmounted) {
      return
    }

    showPhotoWall.value = true
  }

  photoWallDelayTask = window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      photoWallIdleTask = window.requestIdleCallback(renderPhotoWall, { timeout: 1200 })
      return
    }

    renderPhotoWall()
  }, 650)
}

onMounted(async () => {
  await loadHome()
  schedulePhotoWall()
})

onBeforeUnmount(() => {
  isHomeUnmounted = true
  window.clearTimeout(photoWallDelayTask)

  if (photoWallIdleTask && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(photoWallIdleTask)
  }
})

const panelNavItems = ref([])
const siteCards = ref([])
const posts = ref([])
const blogInfo = ref([])
</script>

<template>
  <div class="home-page">
    <section v-if="isHomeLoading" class="home-entry-loading" aria-live="polite">
      <div class="home-entry-loader" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>首页加载中</p>
    </section>

    <template v-else>
      <div class="hero-visual home-page-visual" aria-label="流动照片背景">
        <div v-if="!showPhotoWall" class="photo-wall-loading" aria-live="polite">
          <div class="photo-loading-mark" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>照片墙加载中</p>
        </div>

        <div v-else class="photo-wall-track">
          <div
            v-for="(segment, segmentIndex) in photoWallSegments"
            :key="segmentIndex"
            class="photo-wall-segment"
            :aria-hidden="segmentIndex > 0"
          >
            <div
              v-for="row in segment"
              :key="row.id"
              :class="['photo-wall-row', row.heightClass]"
            >
              <figure
                v-for="photo in row.photos"
                :key="photo.id"
                :class="['photo-wall-item', photo.spanClass]"
                :style="{ '--photo-bg': `url(${photo.url})` }"
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
      </div>

      <div class="home-content">
    <section class="home-hero">
      <aside class="hero-profile-panel">
        <div class="hero-panel-side">
          <div class="music-widget">
            <button class="music-play-button" type="button" aria-label="播放音乐" @click="togglePlay">
              <span>{{ isPlaying ? '⏸' : '♪' }}</span>
            </button>
            <div class="music-copy">
              <strong>正在播放</strong>
              <span>{{ currentTrack ? currentTrack.title : '生活与代码的背景音乐' }}</span>
            </div>
            <div class="music-controls" aria-label="音乐切换按钮">
              <button type="button" aria-label="上一首" @click="playPrev">
                ⏮
              </button>
              <button type="button" aria-label="下一首" @click="playNext">
                ⏭
              </button>
            </div>
            <div v-if="currentTrack" class="music-progress">
              <span class="music-time">{{ formatTime(currentTime) }}</span>
              <div class="music-progress-bar">
                <div class="music-progress-fill" :style="{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }"></div>
              </div>
              <span class="music-time">{{ formatTime(duration) }}</span>
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
            <RouterLink
              v-for="social in internalSocials"
              :key="social.label"
              :to="social.detailPath"
              :title="social.displayValue"
              class="profile-social-link"
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
              <small>{{ social.displayValue }}</small>
            </RouterLink>

            <a
              v-for="social in externalSocials"
              :key="social.label"
              :href="social.href"
              :title="social.displayValue"
              class="profile-social-link"
              target="_blank"
              rel="noreferrer"
            >
              <svg v-if="social.icon === 'github'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.86 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.91c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.96c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92v2.81c0 .27.18.59.69.49A10.15 10.15 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
              </svg>
              <span v-else>@</span>
              <small>{{ social.displayValue }}</small>
            </a>

            <div
              v-for="social in emailSocials"
              :key="social.label"
              role="button"
              tabindex="0"
              :aria-label="`显示邮箱：${social.displayValue}`"
              :aria-expanded="activeEmailPopup === social.type"
              class="profile-social-link profile-social-email"
              @click="toggleEmailPopup(social.type)"
              @keydown.enter.prevent="toggleEmailPopup(social.type)"
              @keydown.space.prevent="toggleEmailPopup(social.type)"
            >
              <span>@</span>
              <small>{{ social.displayValue }}</small>
              <div
                v-if="activeEmailPopup === social.type"
                class="email-click-popover is-visible"
                role="dialog"
                aria-label="邮箱联系方式"
                @click.stop
              >
                <span class="email-popover-title">邮箱联系</span>
                <span class="email-address-box">{{ social.displayValue }}</span>
                <span class="email-popover-hint">用于项目合作、技术交流和其它联系。</span>
                <button
                  type="button"
                  class="email-copy-button"
                  @click.stop="copyEmail(social.displayValue)"
                >
                  <span>{{ emailCopyStatus || '复制邮箱' }}</span>
                </button>
              </div>
            </div>
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
          <small>手机号：{{ profile.phone }}</small>
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

      <audio
        ref="audioElement"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @error="handleAudioError"
      />
    </template>
  </div>
</template>