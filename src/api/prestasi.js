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
    return apiClient.get('/prestasi', { params })
  },

  getById(id) {
    return apiClient.get(`/prestasi/${id}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/prestasi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (key !== 'id') {
        // Skip foto jika null (tidak ganti foto)
        if (key === 'foto' && !data[key]) {
          return
        }
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key])
        }
      }
    })

    // Method spoofing untuk Laravel
    formData.append('_method', 'PUT')

    // Gunakan POST dengan explicit config
    return apiClient({
      method: 'POST',
      url: `/prestasi/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/prestasi/${id}`)
  },

  getStatistics() {
    return apiClient.get('/prestasi-statistics')
  },
}
