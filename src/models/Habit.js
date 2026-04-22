const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Health', 'Personal', 'Work', 'Fitness', 'Other'],
    default: 'Other',
  },
  goal: {
    type: Number,
    default: 1,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastCompletedDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Habit', habitSchema);