const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized — malformed token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been disabled. Contact admin.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    logger.error('Auth middleware error', { error: err.message });
    res.status(401).json({ message: 'Authentication failed' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};
