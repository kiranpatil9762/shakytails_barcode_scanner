const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema(
  {
    qrCodeId: {
      type: String,
      unique: true,
      required: true,
    },
    qrCodeImage: {
      type: String,
      required: true,
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
    pet: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pet',
      default: null,
    },
    assignedAt: {
      type: Date,
    },
    batchNumber: {
      type: String,
    },
    printedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['available', 'assigned', 'active', 'inactive'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QRCodeInventory', QRCodeSchema);
