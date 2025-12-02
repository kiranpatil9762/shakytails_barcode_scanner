const express = require('express');
const { getPublicPetProfile, reportFoundPet } = require('../controllers/petController');

const router = express.Router();

// Public routes - no authentication required
router.get('/pet/:qrId', getPublicPetProfile);
router.post('/pet/found/:qrId', reportFoundPet);

module.exports = router;
