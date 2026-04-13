const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 100 },
  email:    {
    type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
  phone:    {
    type: String, required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
  },
  role:     { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar:   { type: String, default: '' },
  address:  { type: String, default: '', maxlength: 500 },
  dob:      { type: Date },
  gender:   { type: String, enum: ['male', 'female', 'other'] },
  guardianName:  { type: String, default: '', maxlength: 100 },
  guardianPhone: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  // Password reset
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
