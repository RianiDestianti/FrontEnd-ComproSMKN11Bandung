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
  // Public: ambil testimoni published
  getAll() {
    return apiClient.get('/testimoni')
  },

  // Public: kirim testimoni baru (masuk sebagai pending)
  create(data) {
    return apiClient.post('/testimoni', data)
  },

  // Admin: ambil semua testimoni (pending & published)
  adminGetAll() {
    return apiClient.get('/admin/testimoni')
  },

  // Admin: update status (pending -> published atau sebaliknya)
  updateStatus(id, status) {
    return apiClient.patch(`/admin/testimoni/${id}/status`, { status })
  },

  // Admin: hapus testimoni
  delete(id) {
    return apiClient.delete(`/admin/testimoni/${id}`)
  },
}
