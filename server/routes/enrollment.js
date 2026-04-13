const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');

router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const list = await Enrollment.find({ status: 'pending' })
      .populate('userId', 'name email phone createdAt')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending enrollments' });
  }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const list = await Enrollment.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
});

module.exports = router;
