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
    return apiClient.get('/kategori-berita', { params })
  },

  getById(id) {
    return apiClient.get(`/kategori-berita/${id}`)
  },

  create(data) {
    return apiClient.post('/kategori-berita', data)
  },

  update(id, data) {
    return apiClient.put(`/kategori-berita/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/kategori-berita/${id}`)
  },

  search(query) {
    return apiClient.get('/kategori-berita', { params: { search: query } })
  },
}
