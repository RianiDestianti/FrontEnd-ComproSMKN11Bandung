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
    return apiClient.get('/kelas', { params })
  },

  getById(id) {
    return apiClient.get(`/kelas/${id}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/kelas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    formData.append('_method', 'PUT')

    return apiClient.post(`/kelas/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/kelas/${id}`)
  },

  getFormData() {
    return apiClient.get('/kelas/form-data')
  },

  getByTingkat(tingkat) {
    return apiClient.get(`/kelas/tingkat/${tingkat}`)
  },

  getByKonsentrasi(konsentrasiId) {
    return apiClient.get(`/kelas/konsentrasi/${konsentrasiId}`)
  },

  getByWaliKelas(guruId) {
    return apiClient.get(`/kelas/wali-kelas/${guruId}`)
  },

  getByTahunAjaran(tahunAjaran) {
    return apiClient.get(`/kelas/tahun-ajaran/${tahunAjaran}`)
  },
}
