const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} - JWT token
 */
const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Generate Reset Password Token
 * @returns {string} - Reset token
 */
const generateResetToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash Reset Token
 * @param {string} token - Reset token
 * @returns {string} - Hashed token
 */
const hashToken = (token) => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateToken,
  verifyToken,
  generateResetToken,
  hashToken,
};
