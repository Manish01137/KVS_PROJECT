const mongoose = require('mongoose');
const Attendance = mongoose.model('Attendance');
const Notice = mongoose.model('Notice');
const User = require('../models/User');
const logger = require('../utils/logger');

// POST /api/attendance/mark — admin marks attendance
exports.markAttendance = async (req, res) => {
  try {
    const { userId, date, status, session, note } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Student not found' });

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: new Date(date) },
      { status, session: session || 'full', markedBy: req.user._id, note: note || '' },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(attendance);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
};

// POST /api/attendance/bulk — mark multiple students
exports.bulkAttendance = async (req, res) => {
  try {
    const { records, date } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No attendance records provided' });
    }

    const ops = records.map(record => ({
      updateOne: {
        filter: { userId: record.userId, date: new Date(date) },
        update: {
          status: record.status,
          session: record.session || 'full',
          markedBy: req.user._id,
        },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(ops);
    logger.info('Bulk attendance marked', { date, count: records.length, modifiedBy: req.user._id });
    res.json({
      message: `Attendance marked for ${records.length} students`,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    });
  } catch (err) {
    logger.error('Bulk attendance failed', { error: err.message });
    res.status(500).json({ message: 'Failed to mark bulk attendance' });
  }
};

// GET /api/attendance/my — student sees own attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { userId: req.user._id };

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      if (!year || !mon || mon < 1 || mon > 12) {
        return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM' });
      }
      query.date = {
        $gte: new Date(year, mon - 1, 1),
        $lte: new Date(year, mon, 0),
      };
    }

    const records = await Attendance.find(query).sort({ date: 1 });
    const present = records.filter(r => r.status === 'present').length;
    const absent  = records.filter(r => r.status === 'absent').length;
    const leave   = records.filter(r => r.status === 'leave').length;

    res.json({ records, summary: { present, absent, leave, total: records.length } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
};

// GET /api/attendance/student/:id — admin sees a student's attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { userId: req.params.id };

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      if (!year || !mon || mon < 1 || mon > 12) {
        return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM' });
      }
      query.date = {
        $gte: new Date(year, mon - 1, 1),
        $lte: new Date(year, mon, 0),
      };
    }

    const records = await Attendance.find(query).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student attendance' });
  }
};

// --- NOTICES ---

// POST /api/notices — admin creates notice
exports.createNotice = async (req, res) => {
  try {
    const { title, message, target, priority, expiresAt } = req.body;
    const notice = await Notice.create({
      title,
      message,
      target: target || 'all',
      priority: priority || 'normal',
      createdBy: req.user._id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });
    logger.info('Notice created', { noticeId: notice._id, target: notice.target });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create notice' });
  }
};

// GET /api/notices — get notices (filtered by role/type, exclude expired)
exports.getNotices = async (req, res) => {
  try {
    const { target } = req.query;
    const query = {
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };
    if (target) {
      query.target = { $in: [target, 'all'] };
    }

    const notices = await Notice.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
};

// DELETE /api/notices/:id
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    logger.info('Notice deleted', { noticeId: req.params.id });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notice' });
  }
};
