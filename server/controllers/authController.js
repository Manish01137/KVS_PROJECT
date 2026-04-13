const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const FeeConfig = require('../models/FeeConfig');
const Enrollment = require('../models/Enrollment');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../config/mailer');
const { getPlanName } = require('../constants');
const logger = require('../utils/logger');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, dob, gender, guardianName, guardianPhone, enrollmentType, plan } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, address, dob, gender, guardianName, guardianPhone });

    // Get fee for selected plan
    const planKey = getPlanName(enrollmentType, plan);
    const feeConfig = await FeeConfig.findOne({ planName: planKey, isActive: true });
    const admissionConfig = await FeeConfig.findOne({ planName: 'admission', isActive: true });

    await Enrollment.create({
      userId: user._id,
      type: enrollmentType || 'kabaddi',
      plan: plan || 'training',
      status: 'pending',
      feeAmount: feeConfig?.amount || 0,
      admissionFee: admissionConfig?.amount || 0,
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user).catch(() => {});

    const token = signToken(user._id);
    logger.info('New user registered', { userId: user._id, email: user.email });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    logger.error('Registration failed', { error: err.message });
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account disabled. Contact admin.' });
    }

    const token = signToken(user._id);
    logger.info('User logged in', { userId: user._id });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    logger.error('Login failed', { error: err.message });
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, guardianName, guardianPhone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, guardianName, guardianPhone },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user, resetUrl);

    logger.info('Password reset requested', { userId: user._id });
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (err) {
    logger.error('Forgot password failed', { error: err.message });
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = signToken(user._id);
    logger.info('Password reset successful', { userId: user._id });
    res.json({ message: 'Password reset successful', token: jwtToken });
  } catch (err) {
    logger.error('Reset password failed', { error: err.message });
    res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
};
