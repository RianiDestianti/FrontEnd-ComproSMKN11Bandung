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
    return apiClient.get('/siswa', { params })
  },

  getById(id) {
    return apiClient.get(`/siswa/${id}`)
  },

  create(data) {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })

    return apiClient.post('/siswa', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // ✅ PERBAIKAN: Tambahkan parameter fotoZip
  import(file, fotoZip = null) {
    const formData = new FormData()
    formData.append('file', file)

    if (fotoZip) {
      formData.append('foto_zip', fotoZip)
    }

    return apiClient.post('/siswa/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // ✅ METHOD BARU: Import Foto Terpisah
  importFoto(fotoZip) {
    const formData = new FormData()
    formData.append('foto_zip', fotoZip)

    return apiClient.post('/siswa/import-foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  downloadTemplate() {
    const token = localStorage.getItem('token')
    return apiClient.get('/siswa/template', {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
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

    return apiClient.post(`/siswa/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/siswa/${id}`)
  },

  getFormData() {
    return apiClient.get('/siswa/form-data')
  },

  getByKelas(kelasId) {
    return apiClient.get(`/siswa/kelas/${kelasId}`)
  },

  getByStatus(status) {
    return apiClient.get('/siswa', { params: { status } })
  },

  search(query) {
    return apiClient.get('/siswa', { params: { search: query } })
  },
}
