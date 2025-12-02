const express = require('express');
const {
  getReminders,
  getPendingReminders,
  completeReminder,
  deleteReminder,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getReminders);
router.get('/pending', getPendingReminders);
router.put('/:id/complete', completeReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
