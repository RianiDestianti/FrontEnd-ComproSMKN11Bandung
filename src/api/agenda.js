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
    return apiClient.get('/agenda-kegiatan', { params })
  },

  getById(id) {
    return apiClient.get(`/agenda-kegiatan/${id}`)
  },

  create(data) {
    const formData = new FormData()

    formData.append('judul_kegiatan', data.judul_kegiatan)
    formData.append('status', data.status)
    formData.append('tanggal_mulai', data.tanggal_mulai)

    if (data.deskripsi) {
      formData.append('deskripsi', data.deskripsi)
    }

    if (data.tanggal_selesai) {
      formData.append('tanggal_selesai', data.tanggal_selesai)
    }

    if (data.lokasi) {
      formData.append('lokasi', data.lokasi)
    }

    if (data.penyelenggara) {
      formData.append('penyelenggara', data.penyelenggara)
    }

    if (data.peserta) {
      formData.append('peserta', data.peserta)
    }

    if (data.gambar) {
      formData.append('gambar', data.gambar)
    }

    return apiClient.post('/agenda-kegiatan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(id, data) {
    const formData = new FormData()

    formData.append('judul_kegiatan', data.judul_kegiatan)
    formData.append('status', data.status)
    formData.append('tanggal_mulai', data.tanggal_mulai)

    if (data.deskripsi) {
      formData.append('deskripsi', data.deskripsi)
    }

    if (data.tanggal_selesai) {
      formData.append('tanggal_selesai', data.tanggal_selesai)
    }

    if (data.lokasi) {
      formData.append('lokasi', data.lokasi)
    }

    if (data.penyelenggara) {
      formData.append('penyelenggara', data.penyelenggara)
    }

    if (data.peserta) {
      formData.append('peserta', data.peserta)
    }

    if (data.gambar) {
      formData.append('gambar', data.gambar)
    }

    formData.append('_method', 'PUT')

    return apiClient.post(`/agenda-kegiatan/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/agenda-kegiatan/${id}`)
  },
}
