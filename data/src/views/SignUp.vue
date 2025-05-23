<template>
    <div class="auth-container">
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" required/>
        </div>
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="fullName" required/>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required/>
        </div>
        <button type="submit">Create Account</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const username = ref('')
  const fullName = ref('')
  const password = ref('')
  const error    = ref(null)
  const router   = useRouter()
  
  async function handleSignUp() {
     error.value = null

 if (!username.value.trim() || !fullName.value.trim() || !password.value) {
    error.value = 'All fields are required'
    return
  }


  const nameRe = /^[a-zA-Z0-9_]+$/
  if (!nameRe.test(username.value)) {
    error.value = 'Username must be alphanumeric'
    return
  }

 if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

    try {
      await axios.post('/api/auth/signup', {
        username: username.value,
        full_name: fullName.value,
        password: password.value
      })
      router.push('/login')
    } catch (e) {
  console.error('Signup error:', e.response?.data || e.message || e)
  error.value = e.response?.data?.message || 'Could not create account'
}}
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px; margin: auto; padding: 2rem;
    background: #f9f9f9; border-radius: 8px;
  }
  .form-group { margin-bottom: 1rem; }
  label { display: block; margin-bottom: .5rem; }
  input { width: 100%; padding: .5rem; }
  button { background: #228B22; color: white; padding: .75rem; width: 100%; border: none; }
  .error { color: #C71585; margin-top: .5rem; }
  </style>
