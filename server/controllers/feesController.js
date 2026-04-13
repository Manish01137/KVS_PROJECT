const FeeConfig = require('../models/FeeConfig');
const mongoose = require('mongoose');
const FeeHistory = mongoose.model('FeeHistory');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const { getCurrentMonth, getPlanName } = require('../constants');
const logger = require('../utils/logger');

// GET all fee configs
exports.getAllFees = async (req, res) => {
  try {
    const fees = await FeeConfig.find().populate('updatedBy', 'name').sort({ category: 1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fee plans' });
  }
};

// GET fee history (audit log)
exports.getFeeHistory = async (req, res) => {
  try {
    const history = await FeeHistory.find()
      .populate('changedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fee history' });
  }
};

// PUT update a fee - admin only
exports.updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, lateFee, dueDayOfMonth, isActive, description, reason } = req.body;

    const fee = await FeeConfig.findById(id);
    if (!fee) return res.status(404).json({ message: 'Fee plan not found' });

    // Log to history before changing amount
    if (amount !== undefined && amount !== fee.amount) {
      await FeeHistory.create({
        planName: fee.planName,
        oldAmount: fee.amount,
        newAmount: amount,
        changedBy: req.user._id,
        reason: reason || '',
      });
      fee.amount = amount;
    }

    if (lateFee !== undefined) fee.lateFee = lateFee;
    if (dueDayOfMonth !== undefined) fee.dueDayOfMonth = dueDayOfMonth;
    if (isActive !== undefined) fee.isActive = isActive;
    if (description !== undefined) fee.description = description;
    fee.updatedBy = req.user._id;

    await fee.save();
    logger.info('Fee updated', { planName: fee.planName, updatedBy: req.user._id });
    res.json({ message: 'Fee updated successfully', fee });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update fee' });
  }
};

// POST seed default fee plans (run once)
exports.seedFees = async (req, res) => {
  try {
    const defaults = [
      { planName: 'kabaddi-training', displayName: 'Kabaddi Training Only', amount: 1000, category: 'kabaddi', planType: 'training', lateFee: 100, dueDayOfMonth: 5, description: 'Monthly kabaddi training fee' },
      { planName: 'kabaddi-hostel',   displayName: 'Kabaddi Hostel + Training', amount: 5500, category: 'kabaddi', planType: 'hostel', lateFee: 200, dueDayOfMonth: 5, description: 'Monthly hostel + training fee' },
      { planName: 'gym-monthly',      displayName: 'Gym Monthly', amount: 800, category: 'gym', planType: 'gym-monthly', lateFee: 100, dueDayOfMonth: 5, description: 'Monthly gym membership' },
      { planName: 'gym-quarterly',    displayName: 'Gym Quarterly', amount: 2100, category: 'gym', planType: 'gym-quarterly', type: 'onetime', lateFee: 0, description: '3-month gym membership' },
      { planName: 'combo',            displayName: 'Kabaddi + Gym Combo', amount: 1600, category: 'combo', planType: 'combo', lateFee: 150, dueDayOfMonth: 5, description: 'Combo plan - save Rs.200' },
      { planName: 'admission',        displayName: 'Admission Fee', amount: 500, category: 'kabaddi', planType: 'admission', type: 'onetime', lateFee: 0, description: 'One-time admission fee' },
    ];
    for (const d of defaults) {
      await FeeConfig.findOneAndUpdate({ planName: d.planName }, d, { upsert: true, new: true });
    }
    logger.info('Default fees seeded');
    res.json({ message: 'Default fees seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to seed fees' });
  }
};

// Cron job: apply late fees to unpaid students
exports.applyLateFees = async () => {
  const month = getCurrentMonth();
  let processedCount = 0;

  try {
    const activeEnrollments = await Enrollment.find({ status: 'active', isWaived: false });

    for (const enrollment of activeEnrollments) {
      const paid = await Payment.findOne({ userId: enrollment.userId, month, status: 'paid' });
      if (!paid) {
        const planKey = getPlanName(enrollment.type, enrollment.plan);
        const feeConfig = await FeeConfig.findOne({ planName: planKey, isActive: true });
        if (feeConfig?.lateFee > 0) {
          processedCount++;
          logger.info('Late fee applicable', {
            userId: enrollment.userId.toString(),
            lateFee: feeConfig.lateFee,
            month,
          });
        }
      }
    }

    logger.info(`Late fee check complete: ${processedCount} students with late fees for ${month}`);
  } catch (err) {
    logger.error('Apply late fees failed', { error: err.message });
    throw err;
  }
};

// PUT waive fee for specific student
exports.waiveFee = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { reason } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.isWaived = true;
    enrollment.waivedReason = reason || '';
    await enrollment.save();

    logger.info('Fee waived', { enrollmentId, wavedBy: req.user._id });
    res.json({ message: 'Fee waived for student', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to waive fee' });
  }
};

// PUT apply discount to student
exports.applyDiscount = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { discount, discountReason } = req.body;

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.discount = discount;
    enrollment.discountReason = discountReason || '';
    await enrollment.save();

    logger.info('Discount applied', { enrollmentId, discount, appliedBy: req.user._id });
    res.json({ message: 'Discount applied', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply discount' });
  }
};
