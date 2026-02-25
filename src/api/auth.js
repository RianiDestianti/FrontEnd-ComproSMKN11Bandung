import apiClient from './axios'

export default {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  logout() {
    return apiClient.post('/auth/logout')
  },

  getUser() {
    return apiClient.get('/auth/user')
  },

  logoutAll() {
    return apiClient.post('/auth/logout-all')
  }
}