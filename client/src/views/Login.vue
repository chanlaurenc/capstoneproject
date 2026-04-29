<template>
  <div class="auth-page">
    <h1>Habit Streak Tracker</h1>
    <p>Track your habits and stay consistent</p>

    <div class="card">
      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </div>
      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter your password" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button @click="handleLogin">Login</button>
      <p>Don't have an account? <RouterLink to="/register">Sign up</RouterLink></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          email: this.email,
          password: this.password
        })
        const authStore = useAuthStore()
        authStore.setAuth(res.data.token, res.data.user)
        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
      }
    }
  }
}
</script>