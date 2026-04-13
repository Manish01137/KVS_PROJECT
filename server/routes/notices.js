const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, createNoticeSchema } = require('../utils/validators');

router.post('/',      protect, adminOnly, validate(createNoticeSchema), createNotice);
router.get('/',       protect, getNotices);
router.delete('/:id', protect, adminOnly, deleteNotice);

module.exports = router;
