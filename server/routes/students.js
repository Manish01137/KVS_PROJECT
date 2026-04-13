const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// GET /api/students/me/enrollment
router.get('/me/enrollment', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrollment' });
  }
});

// GET /api/students/me/profile
router.get('/me/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const enrollment = await Enrollment.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ user, enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;
