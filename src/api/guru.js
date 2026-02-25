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
  getAll() {
    return apiClient.get('/guru')
  },

  getById(id) {
    return apiClient.get(`/guru/${id}`)
  },

  create(data) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/guru', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  import(data) {
    return apiClient.post('/guru/import', { data })
  },

  update(id, data) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post(`/guru/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete(id) {
    return apiClient.delete(`/guru/${id}`)
  },
}
