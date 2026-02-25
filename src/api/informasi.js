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
    return apiClient.get('/informasi-umum', { params })
  },

  getById(id) {
    return apiClient.get(`/informasi-umum/${id}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/informasi-umum', formData, {
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

    return apiClient.post(`/informasi-umum/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/informasi-umum/${id}`)
  },

  getFormData() {
    return apiClient.get('/informasi-umum/form-data')
  },

  getByKategori(kategoriId) {
    return apiClient.get('/informasi-umum', { params: { kategori_informasi_id: kategoriId } })
  },

  getByPrioritas(prioritas) {
    return apiClient.get('/informasi-umum', { params: { prioritas } })
  },

  getByStatus(status) {
    return apiClient.get('/informasi-umum', { params: { status } })
  },

  search(query) {
    return apiClient.get('/informasi-umum', { params: { search: query } })
  },
}
