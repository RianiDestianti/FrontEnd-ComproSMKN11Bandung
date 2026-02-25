import { defineStore } from 'pinia'
import { ref } from 'vue'
import profilApi from '@/api/profil'

export const useProfilStore = defineStore('profil', () => {
  const profil = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchProfil() {
    loading.value = true
    error.value = null

    try {
      const response = await profilApi.getProfilSekolah()
      
      if (response.data.success) {
        profil.value = response.data.data
        return { success: true, data: response.data.data }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil profil sekolah'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateProfil(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await profilApi.updateProfilSekolah(id, data)
      
      if (response.data.success) {
        profil.value = response.data.data
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data 
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengupdate profil sekolah'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors
      }
    } finally {
      loading.value = false
    }
  }

  async function updateProfilWithFile(id, formData) {
    loading.value = true
    error.value = null

    try {
      const response = await profilApi.updateProfilSekolahWithFile(id, formData)
      
      if (response.data.success) {
        profil.value = response.data.data
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data 
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengupdate profil sekolah'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors
      }
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    profil,
    loading,
    error,
    fetchProfil,
    updateProfil,
    updateProfilWithFile,
    clearError
  }
})