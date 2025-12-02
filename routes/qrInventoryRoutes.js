const express = require('express');
const {
  generateBulkQRCodes,
  getAvailableQRCodes,
  getAllQRCodes,
  verifyQRCode,
  getInventoryStats,
  deleteBatch,
} = require('../controllers/qrInventoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route
router.get('/verify/:qrCodeId', verifyQRCode);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/generate-bulk', generateBulkQRCodes);
router.get('/available', getAvailableQRCodes);
router.get('/stats', getInventoryStats);
router.get('/', getAllQRCodes);
router.delete('/batch/:batchNumber', deleteBatch);

module.exports = router;
