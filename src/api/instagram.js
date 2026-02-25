import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default {
  getAll() {
    return apiClient.get('/instagram')
  },
  adminGetAll() {
    return apiClient.get('/admin/instagram')
  },
  create(data) {
    return apiClient.post('/admin/instagram', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update(id, data) {
    return apiClient.post(`/admin/instagram/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete(id) {
    return apiClient.delete(`/admin/instagram/${id}`)
  },
  toggleStatus(id) {
    return apiClient.patch(`/admin/instagram/${id}/toggle-status`)
  },
}
