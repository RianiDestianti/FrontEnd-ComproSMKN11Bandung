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
    return apiClient.get('/berita', { params })
  },

  getById(id) {
    return apiClient.get(`/berita/${id}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/berita', formData, {
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

    return apiClient.post(`/berita/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/berita/${id}`)
  },

  getFormData() {
    return apiClient.get('/berita/form-data')
  },

  getByKategori(kategoriId) {
    return apiClient.get('/berita', { params: { kategori_berita_id: kategoriId } })
  },

  getByStatus(status) {
    return apiClient.get('/berita', { params: { status } })
  },

  search(query) {
    return apiClient.get('/berita', { params: { search: query } })
  },

  incrementViews(id) {
    return apiClient.post(`/berita/${id}/views`)
  },
}
