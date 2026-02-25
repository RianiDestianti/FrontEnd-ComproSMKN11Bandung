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
    return apiClient.get('/social-media', { params })
  },

  getById(id) {
    return apiClient.get(`/social-media/${id}`)
  },

  create(data) {
    console.log('Sending data:', data) // Tambahkan ini
    return apiClient
      .post('/social-media', data)
      .then((response) => {
        console.log('Response:', response) // Tambahkan ini
        return response
      })
      .catch((error) => {
        console.error('API Error:', error.response?.data) // Tambahkan ini
        throw error
      })
  },

  update(id, data) {
    return apiClient.put(`/social-media/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/social-media/${id}`)
  },
}
