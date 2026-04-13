const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// Verify connection on startup (non-blocking)
if (process.env.EMAIL_USER) {
  transporter.verify()
    .then(() => logger.info('Email transporter ready'))
    .catch(err => logger.warn('Email transporter not ready', { error: err.message }));
}

const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"KVS Academy" <${process.env.EMAIL_USER}>`,
      ...options,
    });
    logger.info('Email sent', { to: options.to, subject: options.subject });
  } catch (err) {
    logger.error('Email send failed', { to: options.to, error: err.message });
    // Don't throw — email failures shouldn't break the main flow
  }
};

exports.sendPaymentReceipt = async (user, payment) => {
  await sendEmail({
    to: user.email,
    subject: `Payment Receipt - ₹${payment.amount} | KVS Academy`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;">KVS Kabaddi Academy</h2>
          <p style="color:#aaa;margin:4px 0 0;">Payment Receipt</p>
        </div>
        <div style="padding:24px;">
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your payment has been received successfully.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr style="background:#f9f9f9;"><td style="padding:8px 12px;"><strong>Amount</strong></td><td style="padding:8px 12px;">₹${payment.amount}</td></tr>
            <tr><td style="padding:8px 12px;"><strong>Plan</strong></td><td style="padding:8px 12px;">${payment.planName}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px 12px;"><strong>Month</strong></td><td style="padding:8px 12px;">${payment.month || 'N/A'}</td></tr>
            <tr><td style="padding:8px 12px;"><strong>Payment ID</strong></td><td style="padding:8px 12px;">${payment.razorpayPaymentId}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px 12px;"><strong>Date</strong></td><td style="padding:8px 12px;">${new Date(payment.paidAt).toLocaleDateString('en-IN')}</td></tr>
            ${payment.lateFeeAmount > 0 ? `<tr><td style="padding:8px 12px;"><strong>Late Fee</strong></td><td style="padding:8px 12px;color:#ef4444;">₹${payment.lateFeeAmount}</td></tr>` : ''}
          </table>
          <p style="color:#666;font-size:13px;">If you have any questions, contact us at info@kvsacademy.org or call +91 8302344092</p>
        </div>
        <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999;">
          KVS Kabaddi Academy, Siriyade Gaon, Jodhpur, Rajasthan - 342015
        </div>
      </div>
    `,
  });
};

exports.sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to KVS Kabaddi Academy!',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;">KVS Kabaddi Academy</h2>
          <p style="color:#aaa;margin:4px 0 0;">Welcome!</p>
        </div>
        <div style="padding:24px;">
          <h3>Welcome, ${user.name}!</h3>
          <p>Your registration at KVS Kabaddi Academy has been received. Your enrollment is pending admin approval.</p>
          <p>You'll be notified once the admin approves your enrollment. You can then login and pay your fees.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <strong>What's next?</strong>
            <ol style="margin:8px 0;padding-left:20px;">
              <li>Admin reviews your enrollment</li>
              <li>You get approved (usually within 24 hours)</li>
              <li>Pay your fees online</li>
              <li>Start your training!</li>
            </ol>
          </div>
          <p>Train Like a Pro. Play Like a Champion.</p>
        </div>
        <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999;">
          KVS Kabaddi Academy, Siriyade Gaon, Jodhpur, Rajasthan - 342015
        </div>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset - KVS Academy',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;">KVS Kabaddi Academy</h2>
          <p style="color:#aaa;margin:4px 0 0;">Password Reset</p>
        </div>
        <div style="padding:24px;">
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:#e94560;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
              Reset Password
            </a>
          </div>
          <p style="color:#666;font-size:13px;">This link expires in 30 minutes. If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999;">
          KVS Kabaddi Academy, Siriyade Gaon, Jodhpur, Rajasthan - 342015
        </div>
      </div>
    `,
  });
};

exports.sendEnrollmentApprovedEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Enrollment Approved! - KVS Academy',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;">KVS Kabaddi Academy</h2>
        </div>
        <div style="padding:24px;">
          <h3>Congratulations, ${user.name}!</h3>
          <p>Your enrollment has been <strong style="color:#10b981;">approved</strong>! You can now login and pay your fees to get started.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="display:inline-block;background:#10b981;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
              Login & Pay Fees
            </a>
          </div>
        </div>
      </div>
    `,
  });
};
