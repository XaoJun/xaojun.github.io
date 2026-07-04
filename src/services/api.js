const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const request = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const getHome = () => request('/api/home')
export const getProfile = () => request('/api/profile')
export const getIdentities = () => request('/api/identities')
export const getContentDirections = () => request('/api/content-directions')
export const getTechnologies = () => request('/api/technologies')
export const getSocials = () => request('/api/socials')
export const getSocialContact = (type) => request(`/api/socials/${encodeURIComponent(type)}`)
export const getTechnicalArticleStat = () => request('/api/stats/technical-articles')
export const getLifePhotoStat = () => request('/api/stats/life-photos')
export const getPosts = () => request('/api/posts')
export const getPost = (slug) => request(`/api/posts/${encodeURIComponent(slug)}`)
export const getPhotos = () => request('/api/photos')
export const getResume = () => request('/api/resume')
export const getMusicTracks = () => request('/api/music')
