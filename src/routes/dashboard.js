const express = require('express');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /api/dashboard — get user dashboard data
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Check which habits are already completed today
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const todayLogs = await HabitLog.find({
      userId: req.userId,
      date: today,
    });

    const completedToday = new Set(todayLogs.map((log) => log.habitId.toString()));

    const habitsWithStatus = habits.map((habit) => ({
      ...habit.toObject(),
      completedToday: completedToday.has(habit._id.toString()),
    }));

    res.json({
      user,
      habits: habitsWithStatus,
      totalHabits: habits.length,
      completedTodayCount: completedToday.size,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;