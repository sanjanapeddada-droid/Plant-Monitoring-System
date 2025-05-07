import { createApp } from 'vue'
import App          from './App.vue'
import router       from './router'
import axios        from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

createApp(App)
  .use(router)
  .mount('#app')
