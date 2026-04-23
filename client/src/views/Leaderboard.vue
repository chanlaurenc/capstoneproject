<template>
  <div class="page">
    <nav>
      <span class="brand">Habit Streak Tracker</span>
      <div>
        <RouterLink to="/dashboard">Home</RouterLink>
        <button @click="handleLogout">Logout</button>
      </div>
    </nav>

    <div class="content">
      <h1>Leaderboard</h1>
      <p>See where you rank among all users</p>

      <p v-if="loading">Loading...</p>

      <div v-else class="leaderboard-table">
        <div class="table-header">
          <span>Rank</span>
          <span>User</span>
          <span>Streak</span>
        </div>
        <div v-for="entry in leaderboard" :key="entry.rank" class="table-row">
          <span class="rank" :class="'rank-' + entry.rank">{{ entry.rank }}</span>
          <span>{{ entry.username }}</span>
          <span>🔥 {{ entry.maxStreak }} days</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Leaderboard',
  data() {
    return {
      leaderboard: [],
      loading: true
    }
  },
  mounted() {
    this.fetchLeaderboard()
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const token = useAuthStore().token
        const res = await axios.get('http://localhost:3000/api/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.leaderboard = res.data
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    handleLogout() {
      useAuthStore().logout()
      this.$router.push('/login')
    }
  }
}
</script>