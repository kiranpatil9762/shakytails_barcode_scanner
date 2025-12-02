const express = require('express');
const {
  generatePetQRCode,
  regeneratePetQRCode,
  getQRCodeDataURL,
} = require('../controllers/qrController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/generate/:petId', generatePetQRCode);
router.post('/regenerate/:petId', regeneratePetQRCode);
router.get('/dataurl/:petId', getQRCodeDataURL);

module.exports = router;
