const express = require('express');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All habit routes require authentication
router.use(authMiddleware);

// GET /api/habits — get all habits for logged-in user
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/habits — create a new habit
router.post('/', async (req, res) => {
  try {
    const { name, category, goal } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    const habit = await Habit.create({
      userId: req.userId,
      name,
      category: category || 'Other',
      goal: goal || 1,
    });

    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/habits/:id — update a habit
router.put('/:id', async (req, res) => {
  try {
    const { name, category, goal } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, category, goal },
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/habits/:id — delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Clean up associated logs
    await HabitLog.deleteMany({ habitId: req.params.id });

    res.json({ message: 'Habit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/habits/:id/log — log completion for today (once per day)
router.post('/:id/log', async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Count how many times logged today
    const todayCount = await HabitLog.countDocuments({ habitId: habit._id, date: today });

    if (todayCount >= habit.goal) {
      return res.status(409).json({ message: 'Goal already reached for today' });
    }

    // Create log entry (allow multiple per day now)
    await HabitLog.create({ userId: req.userId, habitId: habit._id, date: today });

    // If this log completes the goal, update streak
    if (todayCount + 1 === habit.goal) {
      const yesterday = new Date(today);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);

      const lastDate = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;
      if (lastDate) lastDate.setUTCHours(0, 0, 0, 0);

      if (lastDate && lastDate.getTime() === yesterday.getTime()) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }
      habit.lastCompletedDate = today;
      await habit.save();
    }

    res.json({ message: 'Logged successfully', todayCount: todayCount + 1, goal: habit.goal });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;