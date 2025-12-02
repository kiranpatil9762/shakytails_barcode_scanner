const mongoose = require('mongoose');

const FoundReportSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pet',
      required: true,
    },
    finderName: {
      type: String,
      trim: true,
    },
    finderEmail: {
      type: String,
      trim: true,
    },
    finderPhone: {
      type: String,
      required: [true, 'Please provide contact information'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the location where pet was found'],
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FoundReport', FoundReportSchema);
