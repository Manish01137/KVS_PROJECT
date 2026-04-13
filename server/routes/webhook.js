const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Payment = require('../models/Payment');
const logger = require('../utils/logger');

// POST /api/payment/webhook — Razorpay webhook with raw body signature verification
router.post('/', async (req, res) => {
  try {
    const sig = req.headers['x-razorpay-signature'];
    if (!sig) {
      return res.status(400).json({ message: 'Missing webhook signature' });
    }

    // req.body is raw Buffer (set up in index.js with express.raw)
    const rawBody = typeof req.body === 'string' ? req.body : req.body.toString('utf8');

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(rawBody)
      .digest('hex');

    if (sig !== expected) {
      logger.warn('Invalid webhook signature');
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const payload = JSON.parse(rawBody);
    const { event } = payload;

    if (event === 'payment.failed') {
      const orderId = payload.payload?.payment?.entity?.order_id;
      if (orderId) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId, status: 'created' },
          { status: 'failed' }
        );
        logger.info('Webhook: payment marked as failed', { orderId });
      }
    }

    if (event === 'payment.captured') {
      const entity = payload.payload?.payment?.entity;
      if (entity?.order_id) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: entity.order_id, status: 'created' },
          {
            status: 'paid',
            razorpayPaymentId: entity.id,
            paidAt: new Date(),
          }
        );
        logger.info('Webhook: payment captured', { orderId: entity.order_id });
      }
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('Webhook processing failed', { error: err.message });
    // Always return 200 to Razorpay to prevent retries on our errors
    res.status(200).json({ received: true, error: 'Processing failed' });
  }
});

module.exports = router;
