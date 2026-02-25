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
    return apiClient.get('/kategori-informasi', { params })
  },

  getById(id) {
    return apiClient.get(`/kategori-informasi/${id}`)
  },

  create(data) {
    return apiClient.post('/kategori-informasi', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    // Jika ada file icon, gunakan FormData
    if (data.icon instanceof File) {
      const formData = new FormData()
      formData.append('nama_kategori', data.nama_kategori)

      if (data.slug) {
        formData.append('slug', data.slug)
      }

      formData.append('icon', data.icon)
      formData.append('_method', 'PUT')

      return apiClient.post(`/kategori-informasi/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }

    // Jika tidak ada file, gunakan JSON biasa dengan PUT
    return apiClient.put(`/kategori-informasi/${id}`, {
      nama_kategori: data.nama_kategori,
      slug: data.slug,
    })
  },

  delete(id) {
    return apiClient.delete(`/kategori-informasi/${id}`)
  },
}
