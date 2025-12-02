const express = require('express');
const {
  adminLogin,
  getAllUsers,
  getAllPets,
  getUserById,
  deleteUser,
  deletePet,
  getDashboardStats,
  toggleUserActive,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin login (public)
router.post('/login', adminLogin);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-active', toggleUserActive);

// Pets management
router.get('/pets', getAllPets);
router.get('/all-pets', getAllPets); // Alias
router.delete('/pets/:id', deletePet);

module.exports = router;
