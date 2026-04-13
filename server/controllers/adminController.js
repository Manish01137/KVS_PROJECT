const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const { getCurrentMonth } = require('../constants');
const { sendEnrollmentApprovedEmail } = require('../config/mailer');
const logger = require('../utils/logger');

// GET /api/admin/dashboard — summary stats
exports.getDashboard = async (req, res) => {
  try {
    const month = getCurrentMonth();

    // Run all count queries in parallel
    const [
      totalStudents,
      activeStudents,
      pendingApproval,
      gymMembers,
      monthlyRevenueResult,
      revenueByMonth,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Enrollment.countDocuments({ status: 'active' }),
      Enrollment.countDocuments({ status: 'pending' }),
      Enrollment.countDocuments({ status: 'active', type: { $in: ['gym', 'both'] } }),
      Payment.aggregate([
        { $match: { status: 'paid', month } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: '$month', total: { $sum: '$amount' } } },
        { $sort: { _id: -1 } },
        { $limit: 6 },
      ]),
    ]);

    res.json({
      totalStudents,
      activeStudents,
      pendingApproval,
      gymMembers,
      monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
      revenueByMonth,
    });
  } catch (err) {
    logger.error('Dashboard fetch failed', { error: err.message });
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

// GET /api/admin/students — all students with enrollment (fixed N+1 query)
exports.getAllStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Use aggregation to join enrollment and last payment in single query
    const [students, totalResult] = await Promise.all([
      User.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
        { $project: { password: 0 } },
        // Join latest enrollment
        {
          $lookup: {
            from: 'enrollments',
            let: { userId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
            ],
            as: 'enrollmentArr',
          },
        },
        // Join latest paid payment
        {
          $lookup: {
            from: 'payments',
            let: { userId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$userId', '$$userId'] }, { $eq: ['$status', 'paid'] }] } } },
              { $sort: { paidAt: -1 } },
              { $limit: 1 },
            ],
            as: 'lastPaymentArr',
          },
        },
        {
          $addFields: {
            enrollment: { $arrayElemAt: ['$enrollmentArr', 0] },
            lastPayment: { $arrayElemAt: ['$lastPaymentArr', 0] },
          },
        },
        { $project: { enrollmentArr: 0, lastPaymentArr: 0 } },
      ]),
      User.countDocuments(query),
    ]);

    res.json({ students, total: totalResult, pages: Math.ceil(totalResult / limit) });
  } catch (err) {
    logger.error('Get students failed', { error: err.message });
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

// GET /api/admin/students/:id — single student full profile
exports.getStudentById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Student not found' });

    const [enrollment, payments] = await Promise.all([
      Enrollment.findOne({ userId: user._id }).sort({ createdAt: -1 }),
      Payment.find({ userId: user._id }).sort({ createdAt: -1 }),
    ]);

    res.json({ user, enrollment, payments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student details' });
  }
};

// PUT /api/admin/enrollment/:id/approve
exports.approveEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.status !== 'pending') {
      return res.status(400).json({ message: `Cannot approve enrollment with status: ${enrollment.status}` });
    }

    enrollment.status = 'active';
    enrollment.approvedBy = req.user._id;
    enrollment.approvedAt = new Date();
    await enrollment.save();

    // Send approval email (non-blocking)
    const student = await User.findById(enrollment.userId);
    if (student) {
      sendEnrollmentApprovedEmail(student).catch(() => {});
    }

    logger.info('Enrollment approved', { enrollmentId: enrollment._id, approvedBy: req.user._id });
    res.json({ message: 'Enrollment approved', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve enrollment' });
  }
};

// PUT /api/admin/enrollment/:id/reject
exports.rejectEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.status !== 'pending') {
      return res.status(400).json({ message: `Cannot reject enrollment with status: ${enrollment.status}` });
    }

    enrollment.status = 'rejected';
    enrollment.notes = req.body.reason || '';
    await enrollment.save();

    logger.info('Enrollment rejected', { enrollmentId: enrollment._id });
    res.json({ message: 'Enrollment rejected', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject enrollment' });
  }
};

// PUT /api/admin/students/:id/toggle-active
exports.toggleStudentActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Student not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot disable admin accounts' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    logger.info(`Student ${user.isActive ? 'activated' : 'deactivated'}`, { userId: user._id });
    res.json({ message: `Student ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle student status' });
  }
};
