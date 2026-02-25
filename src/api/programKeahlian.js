import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Fungsi untuk mendapatkan auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') // Sesuaikan dengan key token Anda
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const programKeahlianApi = {
  getAll() {
    return axios.get(`${API_URL}/program-keahlian`, {
      headers: getAuthHeaders(),
    })
  },

  create(data) {
    const formData = new FormData()
    formData.append('kode_program', data.kode_program)
    formData.append('nama_program', data.nama_program)
    formData.append('deskripsi', data.deskripsi)
    formData.append('status', data.status)
    if (data.gambar) {
      formData.append('gambar', data.gambar)
    }

    return axios.post(`${API_URL}/program-keahlian`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(), // Tambahkan token
      },
    })
  },

  update(id, data) {
    const formData = new FormData()
    formData.append('kode_program', data.kode_program)
    formData.append('nama_program', data.nama_program)
    formData.append('deskripsi', data.deskripsi)
    formData.append('status', data.status)
    if (data.gambar) {
      formData.append('gambar', data.gambar)
    }

    return axios.post(`${API_URL}/program-keahlian/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(), // Tambahkan token
      },
    })
  },

  delete(id) {
    return axios.delete(`${API_URL}/program-keahlian/${id}`, {
      headers: getAuthHeaders(), // Tambahkan token
    })
  },
}

export default programKeahlianApi
