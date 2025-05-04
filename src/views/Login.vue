<template>
  <div class="auth-container">
    <h1>Log In</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" required/>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" required/>
      </div>
      <button type="submit">Log In</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error    = ref(null)
const router   = useRouter()

async function handleLogin() {
  try {
    const res = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('token',  res.data.token)
    localStorage.setItem('user',   JSON.stringify(res.data.user))
    router.push('/menu/myplants')
  } catch {
    error.value = 'Invalid credentials (have you signed up?)'
  }
}
</script>

<style scoped>
/* same styling as SignUp.vue */
.auth-container { max-width: 400px; margin: auto; padding: 2rem; background: #f9f9f9; border-radius: 8px; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: .5rem; }
input { width: 100%; padding: .5rem; }
button { background: #00d950; color: white; padding: .75rem; width: 100%; border: none; }
.error { color: #d84363; margin-top: .5rem; }
</style>
