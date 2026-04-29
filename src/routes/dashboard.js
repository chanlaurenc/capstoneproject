const express = require('express');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const habitsWithStatus = await Promise.all(habits.map(async (habit) => {
      const todayCount = await HabitLog.countDocuments({ habitId: habit._id, date: today });
      return {
        ...habit.toObject(),
        todayCount,
        completedToday: todayCount >= habit.goal
      };
    }));

    res.json({
      user,
      habits: habitsWithStatus,
      totalHabits: habits.length,
      completedTodayCount: habitsWithStatus.filter(h => h.completedToday).length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;