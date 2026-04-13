const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: Date, required: true },
  status:    { type: String, enum: ['present', 'absent', 'leave'], required: true },
  session:   { type: String, enum: ['morning', 'evening', 'full'], default: 'full' },
  markedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note:      { type: String, default: '', maxlength: 500 },
}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
mongoose.model('Attendance', attendanceSchema);

const noticeSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true, maxlength: 200 },
  message:   { type: String, required: true, maxlength: 5000 },
  target:    { type: String, enum: ['all', 'kabaddi', 'gym', 'admin'], default: 'all' },
  priority:  { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date },
}, { timestamps: true });

noticeSchema.index({ target: 1, createdAt: -1 });
noticeSchema.index({ expiresAt: 1 });
mongoose.model('Notice', noticeSchema);
