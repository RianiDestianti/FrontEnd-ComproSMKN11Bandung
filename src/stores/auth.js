// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const storedToken = localStorage.getItem('token')
  const token = ref(
    storedToken && storedToken !== 'null' && storedToken !== 'undefined' ? storedToken : null,
  )

  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => {
    const currentToken = token.value || localStorage.getItem('token')
    return !!(currentToken && currentToken !== 'null' && currentToken !== 'undefined')
  })

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isGuru = computed(() => user.value?.role === 'guru')
  const isStaff = computed(() => user.value?.role === 'staff')
  const userName = computed(() => user.value?.username || 'Guest')
  const userRole = computed(() => user.value?.role_label || 'Guest')

  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)

      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user

        localStorage.setItem('token', token.value)

        return { success: true, data: response.data }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login gagal'
      return {
        success: false,
        message: error.value,
        errors: err.response?.data?.errors,
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true

    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.clear()
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return

    loading.value = true
    error.value = null

    try {
      const response = await authApi.getUser()

      if (response.data.success) {
        user.value = response.data.data
        return { success: true, data: response.data.data }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data user'
      if (err.response?.status === 401) {
        localStorage.clear()
        logout()
      }
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isGuru,
    isStaff,
    userName,
    userRole,
    login,
    logout,
    fetchUser,
    clearError,
  }
})
