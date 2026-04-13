const mongoose = require('mongoose');

const feeConfigSchema = new mongoose.Schema({
  planName:       { type: String, required: true, unique: true },
  displayName:    { type: String, required: true },
  amount:         { type: Number, required: true, min: [0, 'Amount cannot be negative'] },
  type:           { type: String, enum: ['monthly', 'onetime'], default: 'monthly' },
  category:       { type: String, enum: ['kabaddi', 'gym', 'combo'], required: true },
  planType:       { type: String, enum: ['training', 'hostel', 'gym-monthly', 'gym-quarterly', 'combo', 'admission'] },
  lateFee:        { type: Number, default: 0, min: 0 },
  dueDayOfMonth:  { type: Number, default: 5, min: 1, max: 28 },
  isActive:       { type: Boolean, default: true },
  description:    { type: String, default: '', maxlength: 500 },
  updatedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FeeConfig', feeConfigSchema);

// Fee History - audit log
const feeHistorySchema = new mongoose.Schema({
  planName:   { type: String, required: true },
  oldAmount:  { type: Number, required: true },
  newAmount:  { type: Number, required: true },
  changedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason:     { type: String, default: '', maxlength: 500 },
}, { timestamps: true });

feeHistorySchema.index({ planName: 1, createdAt: -1 });

mongoose.model('FeeHistory', feeHistorySchema);
