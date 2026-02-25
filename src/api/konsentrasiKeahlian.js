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
    return apiClient.get('/konsentrasi-keahlian')
  },

  getById(id) {
    return apiClient.get(`/konsentrasi-keahlian/${id}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/konsentrasi-keahlian', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    formData.append('_method', 'PUT')

    return apiClient.post(`/konsentrasi-keahlian/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/konsentrasi-keahlian/${id}`)
  },

  getProgramKeahlianList() {
    return apiClient.get('/program-keahlian') // Gunakan endpoint program-keahlian langsung
  },
}
