const Pet = require('../models/Pet');
const { generateQRCode, generateQRCodeDataURL } = require('../utils/generateQR');

// @desc    Generate QR code for pet
// @route   GET /api/qr/generate/:petId
// @access  Private
exports.generatePetQRCode = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    // Make sure user is pet owner
    if (pet.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    // If QR code already exists, return it
    if (pet.qrCodeImage) {
      return res.status(200).json({
        success: true,
        qrCode: {
          qrCodeId: pet.qrCodeId,
          qrCodeImage: pet.qrCodeImage,
          publicUrl: `${process.env.FRONTEND_URL}/pet/${pet.qrCodeId}`,
          downloadUrl: `${process.env.BASE_URL}${pet.qrCodeImage}`,
        },
      });
    }

    // Generate new QR code
    const qrData = await generateQRCode(pet.qrCodeId, pet._id);

    // Update pet with QR code image
    pet.qrCodeImage = qrData.qrCodeImage;
    await pet.save();

    res.status(200).json({
      success: true,
      qrCode: qrData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Regenerate QR code for pet
// @route   POST /api/qr/regenerate/:petId
// @access  Private
exports.regeneratePetQRCode = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    // Make sure user is pet owner
    if (pet.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    // Generate new QR code
    const qrData = await generateQRCode(pet.qrCodeId, pet._id);

    // Update pet with new QR code image
    pet.qrCodeImage = qrData.qrCodeImage;
    await pet.save();

    res.status(200).json({
      success: true,
      message: 'QR code regenerated successfully',
      qrCode: qrData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get QR code as base64 data URL
// @route   GET /api/qr/dataurl/:petId
// @access  Private
exports.getQRCodeDataURL = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    // Make sure user is pet owner
    if (pet.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    // Generate QR code as data URL
    const dataUrl = await generateQRCodeDataURL(pet.qrCodeId);

    res.status(200).json({
      success: true,
      dataUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
