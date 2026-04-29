<template>
  <div class="page">
    <nav>
      <span class="brand">Habit Streak Tracker</span>
      <div>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <button @click="handleLogout">Logout</button>
      </div>
    </nav>

    <div class="content">
    <div class="dashboard-header">
        <div>
        <h1>Welcome back, {{ user?.username }}!</h1>
        <p>Here are your habits for today</p>
        </div>
        <button class="add-btn" @click="showModal = true">+ Add Habit</button>
    </div>

    <p v-if="loading">Loading...</p>
    <p v-else-if="habits.length === 0">No habits yet — add one to get started!</p>

    <div v-for="habit in habits" :key="habit._id" class="habit-card">
      <div>
        <h3>{{ habit.name }}</h3>
        <p>Category: {{ habit.category }}</p>
        <p>🔥 Streak: {{ habit.currentStreak }} days</p>
      </div>
      <div class="habit-actions">
        <button
          class="complete-btn"
          @click="markComplete(habit._id)"
          :disabled="habit.completedToday"
        >
          {{ habit.completedToday ? 'Completed ✓' : 'Mark Complete' }}
        </button>
        <button class="delete-btn" @click="deleteHabit(habit._id)">Delete</button>
      </div>
    </div>
    </div>

    <CreateHabit v-if="showModal" @close="showModal = false" @created="fetchDashboard" />
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import CreateHabit from '../components/CreateHabit.vue'

export default {
  name: 'Dashboard',
  components: { CreateHabit },
  data() {
    return {
      habits: [],
      loading: true,
      showModal: false
    }
  },
  computed: {
    user() {
      return useAuthStore().user
    }
  },
  mounted() {
    this.fetchDashboard()
  },
  methods: {
    async fetchDashboard() {
      try {
        const token = useAuthStore().token
        const res = await axios.get('http://localhost:3000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.habits = res.data.habits
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async markComplete(habitId) {
      try {
        const token = useAuthStore().token
        await axios.post(`http://localhost:3000/api/habits/${habitId}/log`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchDashboard()
      } catch (err) {
        console.error(err)
      }
    },
    handleLogout() {
      useAuthStore().logout()
      this.$router.push('/login')
    },
      async deleteHabit(habitId) {
        if (!confirm('Are you sure you want to delete this habit?')) return
        try {
          const token = useAuthStore().token
          await axios.delete(`http://localhost:3000/api/habits/${habitId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          await this.fetchDashboard()
        } catch (err) {
          console.error(err)
        }
      }
  }
}
</script>