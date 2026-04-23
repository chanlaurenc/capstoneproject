<template>
  <div class="page">
    <h1>Create Your Account</h1>
    <p>Start tracking habits and building consistency</p>

    <div class="card">
      <div class="field">
        <label>Username</label>
        <input v-model="username" type="text" placeholder="Choose a username" />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </div>
      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Create a password" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button @click="handleRegister">Sign Up</button>
      <p>Already have an account? <RouterLink to="/login">Log in</RouterLink></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleRegister() {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        const authStore = useAuthStore()
        authStore.setAuth(res.data.token, res.data.user)
        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed'
      }
    }
  }
}
</script>