const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrollmentId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
  razorpayOrderId:    { type: String, required: true, unique: true },
  razorpayPaymentId:  { type: String, default: '' },
  razorpaySignature:  { type: String, default: '' },
  amount:             { type: Number, required: true, min: 0 },
  currency:           { type: String, default: 'INR' },
  status:             { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  month:              { type: String, match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'] },
  planName:           { type: String },
  isLateFee:          { type: Boolean, default: false },
  lateFeeAmount:      { type: Number, default: 0, min: 0 },
  receiptUrl:         { type: String, default: '' },
  paidAt:             { type: Date },
  notes:              { type: String, default: '', maxlength: 500 },
}, { timestamps: true });

// Indexes for common queries
paymentSchema.index({ userId: 1, month: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ status: 1, month: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
