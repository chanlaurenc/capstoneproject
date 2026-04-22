const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
});

// Prevent duplicate logs for the same habit on the same day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);