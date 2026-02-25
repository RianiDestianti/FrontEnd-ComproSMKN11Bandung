import apiClient from './axios'

export default {
  getProfilSekolah() {
    return apiClient.get('/profil-sekolah')
  },

  getProfilSekolahAdmin() {
    return apiClient.get('/profil-sekolah/')
  },

  updateProfilSekolah(id, data) {
    return apiClient.put(`/profil-sekolah/${id}`, data)
  },

  updateProfilSekolahWithFile(id, formData) {
    return apiClient.post(`/profil-sekolah/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}