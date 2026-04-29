const express = require('express');
const Habit = require('../models/Habit');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const topStreaks = await Habit.aggregate([
      { $group: { _id: '$userId', maxStreak: { $max: '$currentStreak' } } },
      { $sort: { maxStreak: -1 } },
      { $limit: 10 }
    ]);

    const results = await Promise.all(
      topStreaks.map(async (entry) => {
        const user = await User.findById(entry._id).select('username');
        return {
          username: user ? user.username : 'Unknown',
          maxStreak: entry.maxStreak
        };
      })
    );

    // Assign same rank to tied users
    let rank = 1;
    const leaderboard = results.map((entry, index) => {
      if (index > 0 && entry.maxStreak < results[index - 1].maxStreak) {
        rank = index + 1;
      }
      return { rank, ...entry };
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;