const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateUser,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe); // Alias for /me
router.put('/update', protect, updateUser);
router.put('/update-password', protect, updatePassword);

module.exports = router;
