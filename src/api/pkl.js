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
    return apiClient.get('/praktek-kerja-lapangan', { params })
  },

  getById(id) {
    return apiClient.get(`/praktek-kerja-lapangan/${id}`)
  },

  getFormData() {
    return apiClient.get('/praktek-kerja-lapangan/form-data')
  },

  create(data) {
    return apiClient.post('/praktek-kerja-lapangan', {
      siswa_id: data.siswa_id,
      perusahaan_pkl_id: data.perusahaan_pkl_id,
      pembimbing_sekolah_id: data.pembimbing_sekolah_id || null,
      pembimbing_industri: data.pembimbing_industri || null,
      no_telepon_industri: data.no_telepon_industri || null,
      tanggal_mulai: data.tanggal_mulai,
      tanggal_selesai: data.tanggal_selesai,
      posisi: data.posisi || null,
      divisi: data.divisi || null,
      nilai: data.nilai || null,
      catatan: data.catatan || null,
      status: data.status,
    })
  },

  update(id, data) {
    return apiClient.put(`/praktek-kerja-lapangan/${id}`, {
      siswa_id: data.siswa_id,
      perusahaan_pkl_id: data.perusahaan_pkl_id,
      pembimbing_sekolah_id: data.pembimbing_sekolah_id || null,
      pembimbing_industri: data.pembimbing_industri || null,
      no_telepon_industri: data.no_telepon_industri || null,
      tanggal_mulai: data.tanggal_mulai,
      tanggal_selesai: data.tanggal_selesai,
      posisi: data.posisi || null,
      divisi: data.divisi || null,
      nilai: data.nilai || null,
      catatan: data.catatan || null,
      status: data.status,
    })
  },

  delete(id) {
    return apiClient.delete(`/praktek-kerja-lapangan/${id}`)
  },
}
