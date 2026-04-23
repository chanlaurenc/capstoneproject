<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>Create Habit</h2>
        <button @click="$emit('close')">X</button>
      </div>

      <div class="field">
        <label>Habit Name</label>
        <input v-model="name" type="text" placeholder="Enter habit name" />
      </div>
      <div class="field">
        <label>Category</label>
        <select v-model="category">
          <option disabled value="">Select a category</option>
          <option>Health</option>
          <option>Personal</option>
          <option>Work</option>
          <option>Fitness</option>
          <option>Other</option>
        </select>
      </div>
      <div class="field">
        <label>Goal</label>
        <input v-model="goal" type="number" placeholder="How many times per day?" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="modal-buttons">
        <button @click="$emit('close')">Cancel</button>
        <button @click="handleCreate">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'CreateHabit',
  emits: ['close', 'created'],
  data() {
    return {
      name: '',
      category: '',
      goal: 1,
      error: ''
    }
  },
  methods: {
    async handleCreate() {
      if (!this.name) {
        this.error = 'Habit name is required'
        return
      }
      try {
        const token = useAuthStore().token
        await axios.post('http://localhost:3000/api/habits', {
          name: this.name,
          category: this.category || 'Other',
          goal: this.goal
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.$emit('created')
        this.$emit('close')
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create habit'
      }
    }
  }
}
</script>