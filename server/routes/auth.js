const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema } = require('../utils/validators');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;
