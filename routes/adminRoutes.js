const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

router.get('/stats', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const coursesCount = await Course.countDocuments();
    const enrollmentsCount = await Enrollment.countDocuments();

    res.json({ usersCount, coursesCount, enrollmentsCount });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
