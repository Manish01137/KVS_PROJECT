const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['kabaddi', 'gym', 'both'], required: true },
  plan:      { type: String, enum: ['training', 'hostel'], default: 'training' },
  status:    { type: String, enum: ['pending', 'active', 'expired', 'rejected'], default: 'pending' },
  joinDate:  { type: Date, default: Date.now },
  endDate:   { type: Date },
  feeAmount: { type: Number, min: 0 },
  discount:  { type: Number, default: 0, min: 0, max: 100 },
  discountReason: { type: String, default: '', maxlength: 500 },
  isWaived:  { type: Boolean, default: false },
  waivedReason: { type: String, default: '', maxlength: 500 },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  admissionFee: { type: Number, default: 0, min: 0 },
  admissionFeePaid: { type: Boolean, default: false },
  notes:     { type: String, default: '', maxlength: 1000 },
}, { timestamps: true });

// Indexes
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
