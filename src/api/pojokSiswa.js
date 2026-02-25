import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// API client dengan auth (untuk admin)
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

// API client tanpa auth (untuk public)
const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default {
  // ============================================
  // PUBLIC METHODS (tanpa auth token)
  // Menggunakan route: /api/pojok-siswa (public routes)
  // ============================================
  getAllPublic(params = {}) {
    return publicClient.get('/pojok-siswa', { params })
  },

  getByIdPublic(id) {
    return publicClient.get(`/pojok-siswa/${id}`)
  },

  incrementViewsPublic(id) {
    return publicClient.post(`/pojok-siswa/${id}/views`)
  },

  getKomentarPublic(pojokSiswaId) {
    return publicClient.get(`/pojok-siswa/${pojokSiswaId}/komentar`)
  },

  addKomentarPublic(pojokSiswaId, data) {
    return publicClient.post(`/pojok-siswa/${pojokSiswaId}/komentar`, data)
  },

  // ============================================
  // ADMIN METHODS (dengan auth token)
  // Menggunakan route: /api/pojok-siswa (admin routes dengan middleware)
  // ============================================
  getAll(params = {}) {
    return apiClient.get('/pojok-siswa', { params })
  },

  getById(id) {
    return apiClient.get(`/pojok-siswa/${id}`)
  },

  deleteKomentar(komentarId) {
    return apiClient.delete(`/komentar/${komentarId}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/pojok-siswa', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      // Skip field yang tidak perlu dikirim
      if (key === 'id' || key === 'gambar_preview' || key === 'file_attachment_name') {
        return
      }

      // Untuk gambar dan file_attachment, hanya kirim jika ada file baru
      if (key === 'gambar' || key === 'file_attachment') {
        if (data[key] instanceof File) {
          formData.append(key, data[key])
        }
        return
      }

      // Field lainnya
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    // Pastikan siswa_id dikirim (bisa kosong untuk anonim)
    if (data.siswa_id === '' || data.siswa_id === null) {
      formData.append('siswa_id', '')
    }

    formData.append('_method', 'PUT')

    return apiClient.post(`/pojok-siswa/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/pojok-siswa/${id}`)
  },

  getFormData() {
    return apiClient.get('/pojok-siswa/form-data')
  },

  incrementViews(id) {
    return apiClient.post(`/pojok-siswa/${id}/views`)
  },

  getByKategori(kategori) {
    return apiClient.get('/pojok-siswa', { params: { kategori } })
  },

  getByStatus(status) {
    return apiClient.get('/pojok-siswa', { params: { status } })
  },

  getBySiswa(siswaId) {
    return apiClient.get('/pojok-siswa', { params: { siswa_id: siswaId } })
  },

  search(query) {
    return apiClient.get('/pojok-siswa', { params: { search: query } })
  },
}
