const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    petName: {
      type: String,
      required: [true, 'Please add a pet name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'other'],
      required: [true, 'Please specify pet type'],
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    color: {
      type: String,
      trim: true,
    },
    qrCodeId: {
      type: String,
      unique: true,
      required: true,
    },
    qrCodeImage: {
      type: String, // Path to QR code image
    },
    profileImage: {
      type: String, // Path to pet profile image
    },
    vaccinationRecords: [
      {
        vaccineName: String,
        date: Date,
        nextDueDate: Date,
        veterinarian: String,
        notes: String,
      },
    ],
    medicalHistory: {
      type: String,
      default: '',
    },
    allergies: {
      type: String,
      default: '',
    },
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],
    isLost: {
      type: Boolean,
      default: false,
    },
    lastKnownLocation: {
      type: String,
      default: '',
    },
    rewardNote: {
      type: String,
      default: '',
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    scanHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        location: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pet', PetSchema);
