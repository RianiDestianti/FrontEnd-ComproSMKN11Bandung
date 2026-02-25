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
  /**
   * Mendapatkan semua data fasilitas dengan filter
   * @param {Object} params - Parameter query (search, kategori, kondisi)
   * @returns {Promise}
   */
  getAll(params = {}) {
    return apiClient.get('/fasilitas', { params })
  },

  /**
   * Mendapatkan detail fasilitas berdasarkan ID
   * @param {Number} id - ID fasilitas
   * @returns {Promise}
   */
  getById(id) {
    return apiClient.get(`/fasilitas/${id}`)
  },

  /**
   * Menambahkan data fasilitas baru
   * @param {Object} data - Data fasilitas
   * @returns {Promise}
   */
  create(data) {
    const formData = new FormData()

    formData.append('nama_fasilitas', data.nama_fasilitas)
    formData.append('kondisi', data.kondisi)
    formData.append('jumlah', data.jumlah || 1)

    if (data.kategori) {
      formData.append('kategori', data.kategori)
    }

    if (data.deskripsi) {
      formData.append('deskripsi', data.deskripsi)
    }

    if (data.gambar && data.gambar instanceof File) {
      formData.append('gambar', data.gambar)
    }

    // Upload multiple galeri
    if (data.galeri && data.galeri.length > 0) {
      data.galeri.forEach((file) => {
        if (file instanceof File) {
          formData.append('galeri[]', file)
        }
      })
    }

    return apiClient.post('/fasilitas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Mengupdate data fasilitas
   * @param {Number} id - ID fasilitas
   * @param {Object} data - Data fasilitas yang akan diupdate
   * @returns {Promise}
   */
  update(id, data) {
    const formData = new FormData()

    formData.append('nama_fasilitas', data.nama_fasilitas)
    formData.append('kondisi', data.kondisi)
    formData.append('jumlah', data.jumlah || 1)

    if (data.kategori) {
      formData.append('kategori', data.kategori)
    }

    if (data.deskripsi) {
      formData.append('deskripsi', data.deskripsi)
    }

    // Hanya append gambar jika ada file baru (bukan string URL)
    if (data.gambar && data.gambar instanceof File) {
      formData.append('gambar', data.gambar)
    }

    // Upload multiple galeri baru - pastikan ini File object
    if (data.galeri && data.galeri.length > 0) {
      data.galeri.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`galeri[]`, file)
        }
      })
    }

    // Gunakan POST dengan _method PUT untuk support file upload
    formData.append('_method', 'PUT')

    return apiClient.post(`/fasilitas/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`/fasilitas/${id}`)
  },

  /**
   * Menghapus gambar galeri
   * @param {Number} id - ID galeri fasilitas
   * @returns {Promise}
   */
  deleteGaleri(id) {
    return apiClient.delete(`/fasilitas/galeri/${id}`)
  },
}
