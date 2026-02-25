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
    return apiClient.get('/jadwal-pelajaran', { params })
  },

  getById(id) {
    return apiClient.get(`/jadwal-pelajaran/${id}`)
  },

  create(data) {
    return apiClient.post('/jadwal-pelajaran', data)
  },

  update(id, data) {
    return apiClient.put(`/jadwal-pelajaran/${id}`, data)
  },

  delete(id) {
    return apiClient.delete(`/jadwal-pelajaran/${id}`)
  },

  getFormData() {
    return apiClient.get('/jadwal-pelajaran/form-data')
  },

  getByKelas(kelasId) {
    return apiClient.get('/jadwal-pelajaran', { params: { kelas_id: kelasId } })
  },

  getByHari(hari) {
    return apiClient.get('/jadwal-pelajaran', { params: { hari } })
  },

  getBySemester(semester) {
    return apiClient.get('/jadwal-pelajaran', { params: { semester } })
  },
}
