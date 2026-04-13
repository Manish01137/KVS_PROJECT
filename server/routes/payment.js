const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyPayments, getAllPayments } = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, paymentOrderSchema } = require('../utils/validators');

router.post('/order',   protect, validate(paymentOrderSchema), createOrder);
router.post('/verify',  protect, verifyPayment);
router.get('/history',  protect, getMyPayments);
router.get('/all',      protect, adminOnly, getAllPayments);

module.exports = router;
