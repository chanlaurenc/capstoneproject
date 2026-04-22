const express = require('express');
const Habit = require('../models/Habit');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /api/leaderboard — top streaks across all users (shows username, anonymous streaks)
router.get('/', async (req, res) => {
  try {
    // Aggregate: find each user's highest current streak
    const topStreaks = await Habit.aggregate([
      {
        $group: {
          _id: '$userId',
          maxStreak: { $max: '$currentStreak' },
        },
      },
      { $sort: { maxStreak: -1 } },
      { $limit: 10 },
    ]);

    // Look up usernames for the top entries
    const leaderboard = await Promise.all(
      topStreaks.map(async (entry, index) => {
        const user = await User.findById(entry._id).select('username');
        return {
          rank: index + 1,
          username: user ? user.username : 'Unknown',
          maxStreak: entry.maxStreak,
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;