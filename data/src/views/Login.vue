<template>
  <div class="auth-container">
    <h1>Log In</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Log In</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Import the auth store
import { auth } from '../stores/auth'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error    = ref(null)
const router   = useRouter()

async function handleLogin() {
   error.value = null


  if (!username.value.trim() || !password.value) {
    error.value = 'Username and password are required'
    return
  }


  if (password.value.length < 6) {
   error.value = 'Password must be at least 6 characters'
    return
  }
  
  try {
    // Sending login request to the backend API
    const res = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value,
    })

    // If login is successful, save the user data and token to the auth store and localStorage
    auth.login(res.data.user, res.data.token)

    // Redirect to the menu after successful login
    router.push('/menu/myplants')
  } catch (err) {
    error.value = 'Invalid credentials (have you signed up?)'
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
}

button {
  background: #228B22;
  color: white;
  padding: 0.75rem;
  width: 100%;
  border: none;
}

.error {
  color: #C71585;
  margin-top: 0.5rem;
}
</style>
