import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default {
  getAll(params = {}) {
    return apiClient.get('/kontak', { params })
  },

  getById(id) {
    return apiClient.get(`/kontak/${id}`)
  },

  create(data) {
    return apiClient.post('/kontak', data)
  },

  update(id, data) {
    return apiClient.put(`/kontak/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/kontak/${id}`)
  },

  markAsRead(id) {
    return apiClient.patch(`/kontak/${id}/mark-as-read`)
  },

  markAsReplied(id) {
    return apiClient.patch(`/kontak/${id}/mark-as-replied`)
  },

  getStatistics() {
    return apiClient.get('/kontak/statistics')
  },
}
