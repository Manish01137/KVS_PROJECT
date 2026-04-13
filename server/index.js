const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const logger = require('./utils/logger');

dotenv.config();

// ── Load all models (must be before routes) ──
require('./models/User');
require('./models/Enrollment');
require('./models/Payment');
require('./models/FeeConfig');
require('./models/Others');

// ── Validate required env vars ──
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();

// ── Security middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate limiting ──
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: { message: 'Too many payment requests. Please try again later.' },
});

app.use(generalLimiter);

// ── Webhook route needs raw body for signature verification ──
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), require('./routes/webhook'));

// ── Body parsing (after webhook to avoid parsing webhook body) ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
      status: dbState === 1 ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbStatus[dbState] || 'unknown',
      uptime: Math.floor(process.uptime()),
    });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: 'Health check failed' });
  }
});

app.get('/', (req, res) => res.json({ message: 'KVS Academy API running', version: '2.0.0' }));

// ── API Routes ──
app.use('/api/auth',       authLimiter, require('./routes/auth'));
app.use('/api/students',   require('./routes/students'));
app.use('/api/enrollment', require('./routes/enrollment'));
app.use('/api/payment',    paymentLimiter, require('./routes/payment'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/fees',       require('./routes/fees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/notices',    require('./routes/notices'));

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Centralized error handler ──
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack, path: req.path });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages[0], errors: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default: don't leak stack traces in production
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── MongoDB connection + server start ──
let server;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection failed', { error: err.message });
    process.exit(1);
  });

// ── Cron: apply late fees on 10th of every month at midnight ──
cron.schedule('0 0 10 * *', async () => {
  try {
    const { applyLateFees } = require('./controllers/feesController');
    await applyLateFees();
    logger.info('Cron: Late fees applied successfully');
  } catch (err) {
    logger.error('Cron: Failed to apply late fees', { error: err.message });
  }
});

// ── Graceful shutdown ──
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      mongoose.connection.close(false).then(() => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
