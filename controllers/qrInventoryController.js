const QRCodeInventory = require('../models/QRCodeInventory');
const { generateUniqueId, generateQRCode } = require('../utils/generateQR');

// @desc    Bulk generate QR codes
// @route   POST /api/qr-inventory/generate-bulk
// @access  Private (Admin)
exports.generateBulkQRCodes = async (req, res) => {
  try {
    const { quantity, batchNumber } = req.body;

    if (!quantity || quantity < 1 || quantity > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be between 1 and 1000',
      });
    }

    const generatedQRCodes = [];
    const batch = batchNumber || `BATCH-${Date.now()}`;

    for (let i = 0; i < quantity; i++) {
      // Generate unique ID
      const qrCodeId = generateUniqueId();

      // Generate QR code image
      const qrData = await generateQRCode(qrCodeId, null);

      // Save to inventory
      const qrInventory = await QRCodeInventory.create({
        qrCodeId,
        qrCodeImage: qrData.qrCodeImage,
        batchNumber: batch,
        status: 'available',
      });

      generatedQRCodes.push({
        qrCodeId: qrInventory.qrCodeId,
        qrCodeImage: qrInventory.qrCodeImage,
        downloadUrl: `${process.env.BASE_URL}${qrInventory.qrCodeImage}`,
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully generated ${quantity} QR codes`,
      batchNumber: batch,
      count: generatedQRCodes.length,
      qrCodes: generatedQRCodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all available QR codes
// @route   GET /api/qr-inventory/available
// @access  Private (Admin)
exports.getAvailableQRCodes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const qrCodes = await QRCodeInventory.find({ status: 'available' })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await QRCodeInventory.countDocuments({ status: 'available' });

    res.status(200).json({
      success: true,
      count: qrCodes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      qrCodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all QR codes (with filters)
// @route   GET /api/qr-inventory
// @access  Private (Admin)
exports.getAllQRCodes = async (req, res) => {
  try {
    const { status, batchNumber } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (batchNumber) filter.batchNumber = batchNumber;

    const qrCodes = await QRCodeInventory.find(filter)
      .populate('pet', 'petName type')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await QRCodeInventory.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: qrCodes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      qrCodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Verify QR code exists and is available
// @route   GET /api/qr-inventory/verify/:qrCodeId
// @access  Public
exports.verifyQRCode = async (req, res) => {
  try {
    const qrCode = await QRCodeInventory.findOne({
      qrCodeId: req.params.qrCodeId,
    });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found',
      });
    }

    res.status(200).json({
      success: true,
      qrCode: {
        qrCodeId: qrCode.qrCodeId,
        isAssigned: qrCode.isAssigned,
        status: qrCode.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get inventory statistics
// @route   GET /api/qr-inventory/stats
// @access  Private (Admin)
exports.getInventoryStats = async (req, res) => {
  try {
    const totalQRCodes = await QRCodeInventory.countDocuments();
    const availableQRCodes = await QRCodeInventory.countDocuments({
      status: 'available',
    });
    const assignedQRCodes = await QRCodeInventory.countDocuments({
      status: 'assigned',
    });
    const activeQRCodes = await QRCodeInventory.countDocuments({
      status: 'active',
    });

    // Get batches
    const batches = await QRCodeInventory.aggregate([
      {
        $group: {
          _id: '$batchNumber',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] },
          },
          assigned: {
            $sum: { $cond: [{ $eq: ['$status', 'assigned'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalQRCodes,
        available: availableQRCodes,
        assigned: assignedQRCodes,
        active: activeQRCodes,
      },
      batches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete unassigned QR codes
// @route   DELETE /api/qr-inventory/batch/:batchNumber
// @access  Private (Admin)
exports.deleteBatch = async (req, res) => {
  try {
    const result = await QRCodeInventory.deleteMany({
      batchNumber: req.params.batchNumber,
      status: 'available',
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} unassigned QR codes from batch`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
