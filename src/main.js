import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/image-cache-sw.js').catch((error) => {
      console.warn('图片缓存 Service Worker 注册失败：', error)
    })
  })
}
