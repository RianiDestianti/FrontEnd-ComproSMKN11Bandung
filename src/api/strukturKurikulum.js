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
    return apiClient.get('/struktur-kurikulum', { params })
  },

  getById(id) {
    return apiClient.get(`/struktur-kurikulum/${id}`)
  },

  create(data) {
    return apiClient.post('/struktur-kurikulum', data)
  },

  update(id, data) {
    return apiClient.put(`/struktur-kurikulum/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/struktur-kurikulum/${id}`)
  },

  getKonsentrasiKeahlian() {
    return apiClient.get('/konsentrasi-keahlian')
  },

  getMataPelajaran() {
    return apiClient.get('/mata-pelajaran')
  },
}
