// utils/authMiddleware.js
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText')

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ status: httpStatusText.FAIL, message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ status: httpStatusText.FAIL, message: 'Invalid token' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: httpStatusText.FAIL, message: 'Admin access required' });
  }
  next();
};