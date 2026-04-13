const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.min': 'Name must be at least 2 characters' }),
  email: Joi.string().email().lowercase().required()
    .messages({ 'string.email': 'Please provide a valid email address' }),
  password: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required()
    .messages({ 'string.pattern.base': 'Please provide a valid 10-digit Indian phone number' }),
  address: Joi.string().max(500).allow('').default(''),
  dob: Joi.date().max('now').allow(null, ''),
  gender: Joi.string().valid('male', 'female', 'other').default('male'),
  guardianName: Joi.string().max(100).allow('').default(''),
  guardianPhone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('').default('')
    .messages({ 'string.pattern.base': 'Please provide a valid guardian phone number' }),
  enrollmentType: Joi.string().valid('kabaddi', 'gym', 'both').default('kabaddi'),
  plan: Joi.string().valid('training', 'hostel').default('training'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
    .messages({ 'string.email': 'Please provide a valid email address' }),
  password: Joi.string().required()
    .messages({ 'any.required': 'Password is required' }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/)
    .messages({ 'string.pattern.base': 'Please provide a valid 10-digit phone number' }),
  address: Joi.string().max(500).allow(''),
  guardianName: Joi.string().max(100).allow(''),
  guardianPhone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('')
    .messages({ 'string.pattern.base': 'Please provide a valid guardian phone number' }),
});

const paymentOrderSchema = Joi.object({
  planName: Joi.string().required()
    .messages({ 'any.required': 'Plan name is required' }),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).allow('', null)
    .messages({ 'string.pattern.base': 'Month must be in YYYY-MM format' }),
});

const markAttendanceSchema = Joi.object({
  userId: Joi.string().hex().length(24).required()
    .messages({ 'string.length': 'Invalid user ID' }),
  date: Joi.date().required(),
  status: Joi.string().valid('present', 'absent', 'leave').required(),
  session: Joi.string().valid('morning', 'evening', 'full').default('full'),
  note: Joi.string().max(500).allow('').default(''),
});

const bulkAttendanceSchema = Joi.object({
  date: Joi.date().required(),
  records: Joi.array().items(Joi.object({
    userId: Joi.string().hex().length(24).required(),
    status: Joi.string().valid('present', 'absent', 'leave').required(),
    session: Joi.string().valid('morning', 'evening', 'full').default('full'),
  })).min(1).required(),
});

const createNoticeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  message: Joi.string().trim().min(5).max(5000).required(),
  target: Joi.string().valid('all', 'kabaddi', 'gym', 'admin').default('all'),
  priority: Joi.string().valid('normal', 'urgent').default('normal'),
  expiresAt: Joi.date().greater('now').allow(null, ''),
});

const updateFeeSchema = Joi.object({
  amount: Joi.number().min(0).max(100000),
  lateFee: Joi.number().min(0).max(10000),
  dueDayOfMonth: Joi.number().integer().min(1).max(28),
  isActive: Joi.boolean(),
  description: Joi.string().max(500).allow(''),
  reason: Joi.string().max(500).allow(''),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
});

// Middleware factory to validate request body against a Joi schema
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ message: messages[0], errors: messages });
    }
    req.body = value;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  paymentOrderSchema,
  markAttendanceSchema,
  bulkAttendanceSchema,
  createNoticeSchema,
  updateFeeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validate,
};
