const mongoose = require('mongoose');

const VaccineReminderSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pet',
      required: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    vaccineName: {
      type: String,
      required: [true, 'Please specify vaccine name'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please specify due date'],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster reminder checks
VaccineReminderSchema.index({ dueDate: 1, reminderSent: 1 });

module.exports = mongoose.model('VaccineReminder', VaccineReminderSchema);
