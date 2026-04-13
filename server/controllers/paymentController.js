const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const FeeConfig = require('../models/FeeConfig');
const Enrollment = require('../models/Enrollment');
const { sendPaymentReceipt } = require('../config/mailer');
const { getCurrentMonth } = require('../constants');
const logger = require('../utils/logger');

let razorpayInstance;
function getRazorpay() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

// POST /api/payment/order — create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { planName, month } = req.body;
    const userId = req.user._id;

    // Fetch current fee from DB
    const feeConfig = await FeeConfig.findOne({ planName, isActive: true });
    if (!feeConfig) return res.status(404).json({ message: 'Fee plan not found' });

    // Check enrollment
    const enrollment = await Enrollment.findOne({ userId, status: 'active' });
    if (!enrollment) return res.status(400).json({ message: 'No active enrollment found' });

    // Check if fee is waived
    if (enrollment.isWaived) {
      return res.status(400).json({ message: 'Your fee has been waived. Contact admin for details.' });
    }

    // Check if already paid this month
    const paymentMonth = month || getCurrentMonth();
    const alreadyPaid = await Payment.findOne({ userId, month: paymentMonth, status: 'paid' });
    if (alreadyPaid) return res.status(400).json({ message: 'Already paid for this month' });

    // Check for existing pending order (idempotency)
    const existingOrder = await Payment.findOne({
      userId, month: paymentMonth, status: 'created',
      createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) }, // within last 30 min
    });
    if (existingOrder) {
      // Return existing order instead of creating duplicate
      return res.json({
        orderId: existingOrder.razorpayOrderId,
        amount: existingOrder.amount,
        lateFeeAmount: existingOrder.lateFeeAmount,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentId: existingOrder._id,
      });
    }

    // Calculate amount with discount
    let amount = feeConfig.amount;
    if (enrollment.discount > 0) {
      amount = Math.round(amount - (amount * enrollment.discount / 100));
    }

    // Check late fee
    const today = new Date().getDate();
    let lateFeeAmount = 0;
    if (today > feeConfig.dueDayOfMonth && feeConfig.lateFee > 0) {
      lateFeeAmount = feeConfig.lateFee;
      amount += lateFeeAmount;
    }

    // Create Razorpay order
    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100), // paise — ensure integer
      currency: 'INR',
      receipt: `rcpt_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        planName,
        month: paymentMonth,
        enrollmentId: enrollment._id.toString(),
      },
    });

    // Save pending payment
    const payment = await Payment.create({
      userId,
      enrollmentId: enrollment._id,
      razorpayOrderId: order.id,
      amount,
      month: paymentMonth,
      planName,
      isLateFee: lateFeeAmount > 0,
      lateFeeAmount,
      status: 'created',
    });

    logger.info('Payment order created', { userId, orderId: order.id, amount });

    res.json({
      orderId: order.id,
      amount,
      lateFeeAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (err) {
    logger.error('Create order failed', { error: err.message, userId: req.user?._id });
    res.status(500).json({ message: 'Failed to create payment order. Please try again.' });
  }
};

// POST /api/payment/verify — verify payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      logger.warn('Invalid payment signature', { orderId: razorpay_order_id });
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Find and update payment — use findOneAndUpdate with status check to prevent double verification
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, status: 'created' }, // Only update if status is 'created'
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!payment) {
      // Check if already verified
      const existing = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (existing?.status === 'paid') {
        return res.json({ message: 'Payment already verified', payment: existing });
      }
      return res.status(404).json({ message: 'Payment order not found' });
    }

    // Send email receipt (non-blocking)
    if (payment.userId?.email) {
      sendPaymentReceipt(payment.userId, payment).catch(() => {});
    }

    logger.info('Payment verified', { paymentId: payment._id, amount: payment.amount });
    res.json({ message: 'Payment verified successfully', payment });
  } catch (err) {
    logger.error('Payment verification failed', { error: err.message });
    res.status(500).json({ message: 'Payment verification failed. Contact admin.' });
  }
};

// GET /api/payment/history — student's payment history
exports.getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Payment.countDocuments({ userId: req.user._id });
    res.json({ payments, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

// GET /api/payment/all — admin: all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { month, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (month) query.month = month;
    if (status) query.status = status;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Payment.countDocuments(query),
    ]);

    res.json({ payments, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};
