const express = require('express');
const router = express.Router();
const { getDashboard, getAllStudents, getStudentById, approveEnrollment, rejectEnrollment, toggleStudentActive } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard',              protect, adminOnly, getDashboard);
router.get('/students',               protect, adminOnly, getAllStudents);
router.get('/students/:id',           protect, adminOnly, getStudentById);
router.put('/enrollment/:id/approve', protect, adminOnly, approveEnrollment);
router.put('/enrollment/:id/reject',  protect, adminOnly, rejectEnrollment);
router.put('/students/:id/toggle',    protect, adminOnly, toggleStudentActive);

module.exports = router;
