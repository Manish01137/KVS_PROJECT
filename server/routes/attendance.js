const express = require('express');
const router = express.Router();
const { markAttendance, bulkAttendance, getMyAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, markAttendanceSchema, bulkAttendanceSchema } = require('../utils/validators');

router.post('/mark',           protect, adminOnly, validate(markAttendanceSchema), markAttendance);
router.post('/bulk',           protect, adminOnly, validate(bulkAttendanceSchema), bulkAttendance);
router.get('/my',              protect, getMyAttendance);
router.get('/student/:id',     protect, adminOnly, getStudentAttendance);

module.exports = router;
