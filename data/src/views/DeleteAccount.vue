<template>
  <div class="delete-container">
    <h2>Delete Account</h2>

    <form @submit.prevent="deleteAccount">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input v-model="confirmation" placeholder='Type "DELETE" to confirm' required />

      <button :disabled="confirmation !== 'DELETE'" type="submit">
        Delete My Account
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { auth } from '../stores/auth'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const confirmation = ref('')
const error = ref(null)
const success = ref(null)
const router = useRouter()

async function deleteAccount() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post('http://localhost:3000/api/auth/delete', {
      username: username.value,
      password: password.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
   

    success.value = res.data.message
    auth.logout()
    router.push('/signup')
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to delete account'
  }
}
</script>
