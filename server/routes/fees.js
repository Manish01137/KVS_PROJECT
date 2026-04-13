const express = require('express');
const router = express.Router();
const { getAllFees, updateFee, seedFees, getFeeHistory, waiveFee, applyDiscount } = require('../controllers/feesController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, updateFeeSchema } = require('../utils/validators');

router.get('/',                              protect, getAllFees);
router.put('/:id',                           protect, adminOnly, validate(updateFeeSchema), updateFee);
router.post('/seed',                         protect, adminOnly, seedFees);
router.get('/history',                       protect, adminOnly, getFeeHistory);
router.put('/waive/:enrollmentId',           protect, adminOnly, waiveFee);
router.put('/discount/:enrollmentId',        protect, adminOnly, applyDiscount);

module.exports = router;
