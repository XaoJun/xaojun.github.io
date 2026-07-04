import { computed, reactive, ref } from 'vue'
import { getMusicTracks } from '../services/api'

const MUSIC_VOLUME = 0.1

const audio = typeof window !== 'undefined' ? new Audio() : null
const tracks = ref([])
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isReady = ref(false)

// 标记用户是否已交互过（浏览器自动播放策略）
let hasUserInteracted = false

if (audio) {
  audio.volume = MUSIC_VOLUME

  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
  })

  audio.addEventListener('loadedmetadata', () => {
    audio.volume = MUSIC_VOLUME
    duration.value = audio.duration || currentTrack.value?.duration || 0
  })

  audio.addEventListener('play', () => {
    isPlaying.value = true
    audio.volume = MUSIC_VOLUME
  })

  audio.addEventListener('pause', () => {
    isPlaying.value = false
  })

  audio.addEventListener('ended', () => {
    playNext()
  })

  audio.addEventListener('error', (event) => {
    console.error('音频加载错误:', event)
  })
}

const currentTrack = computed(() => {
  if (!tracks.value.length) {
    return null
  }
  return tracks.value[currentTrackIndex.value]
})

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) {
    return '00:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const playCurrentTrack = () => {
  if (!audio || !currentTrack.value) {
    return
  }

  audio.src = currentTrack.value.url
  audio.volume = MUSIC_VOLUME
  audio.muted = !hasUserInteracted
  isMuted.value = !hasUserInteracted
  audio.load()
  audio.play().catch((error) => {
    console.error('播放失败:', error)
  })
}

const togglePlay = () => {
  if (!audio || !currentTrack.value) {
    return
  }

  hasUserInteracted = true

  if (isPlaying.value) {
    audio.pause()
  } else {
    if (!audio.src) {
      audio.src = currentTrack.value.url
      audio.load()
    }
    audio.volume = MUSIC_VOLUME
    audio.muted = false
    isMuted.value = false
    audio.play().catch((error) => {
      console.error('播放失败:', error)
    })
  }
}

const play = () => {
  if (!audio || !currentTrack.value || isPlaying.value) {
    return
  }

  if (!audio.src) {
    audio.src = currentTrack.value.url
    audio.load()
  }
  audio.volume = MUSIC_VOLUME
  // 浏览器自动播放策略：无用户交互时静音播放（muted autoplay 允许），交互后有声
  audio.muted = !hasUserInteracted
  isMuted.value = !hasUserInteracted
  return audio.play().catch((error) => {
    console.error('播放失败:', error)
    return false
  })
}

const unmute = () => {
  hasUserInteracted = true
  if (!audio || !isMuted.value) {
    return
  }
  audio.muted = false
  isMuted.value = false
}

const playNext = () => {
  if (tracks.value.length === 0) {
    return
  }
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length
  playCurrentTrack()
}

const playPrev = () => {
  if (tracks.value.length === 0) {
    return
  }
  currentTrackIndex.value =
    (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length
  playCurrentTrack()
}

const loadMusic = async () => {
  try {
    const data = await getMusicTracks()
    tracks.value = data
    isReady.value = true
  } catch (error) {
    console.error('加载音乐列表失败:', error)
  }
}

export function useMusicPlayer() {
  return {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    isReady,
    formatTime,
    togglePlay,
    play,
    unmute,
    playNext,
    playPrev,
    loadMusic,
  }
}
