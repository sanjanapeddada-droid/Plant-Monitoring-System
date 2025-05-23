import { createApp } from 'vue'
import { createPinia } from 'pinia'      // <-- Import Pinia
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Set axios base URL and add Authorization header if token exists
axios.defaults.baseURL = 'http://localhost:3000'
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        const newToken = await refreshToken() // Implement this
        localStorage.setItem('token', newToken)
        error.config.headers.Authorization = `Bearer ${newToken}`
        return axios(error.config)
      } catch (refreshError) {
        localStorage.removeItem('token')
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

// Create Vue app
const app = createApp(App)

// Create Pinia store instance
const pinia = createPinia()

// Use Pinia and router in app
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')
