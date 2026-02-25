import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance dengan config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add token to requests
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
  // Get all kepala sekolah
  getAll() {
    return apiClient.get('/kepala-sekolah')
  },

  // Get active kepala sekolah
  getActive() {
    return apiClient.get('/kepala-sekolah/active')
  },

  // Get kepala sekolah by ID
  getById(id) {
    return apiClient.get(`/kepala-sekolah/${id}`)
  },

  // Create kepala sekolah
  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/kepala-sekolah', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update kepala sekolah
  update(id, data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    return apiClient.post(`/kepala-sekolah/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete kepala sekolah
  delete(id) {
    return apiClient.delete(`/kepala-sekolah/${id}`)
  },
}
