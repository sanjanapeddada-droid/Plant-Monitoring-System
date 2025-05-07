// src/stores/auth.js
import { reactive } from 'vue'

export const auth = reactive({
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),

  get isLoggedIn() {
    return !!this.token
  },

  login(user, token) {
    this.user = user
    this.token = token
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  },

  logout() {
    this.user = null
    this.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
})
