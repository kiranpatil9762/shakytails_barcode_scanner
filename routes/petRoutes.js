const express = require('express');
const {
  createPet,
  updatePet,
  deletePet,
  getMyPets,
  getPet,
  markAsLost,
  addVaccination,
  getPetStats,
} = require('../controllers/petController');
const { protect } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../utils/uploader');

const router = express.Router();

// All routes are protected
router.use(protect);

// Pet CRUD operations
router.post('/create', uploadSingle, handleUploadError, createPet);
router.put('/update/:id', uploadSingle, handleUploadError, updatePet);
router.delete('/delete/:id', deletePet);
router.get('/mine', getMyPets);
router.get('/get/:id', getPet);

// Pet status
router.put('/lost/:id', markAsLost);

// Vaccination
router.post('/:id/vaccination', addVaccination);

// Statistics
router.get('/:id/stats', getPetStats);

module.exports = router;
