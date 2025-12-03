const Pet = require('../models/Pet');
const User = require('../models/User');
const FoundReport = require('../models/FoundReport');
const VaccineReminder = require('../models/VaccineReminder');
const QRCodeInventory = require('../models/QRCodeInventory');
const { generateUniqueId, generateQRCode } = require('../utils/generateQR');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Create pet profile
// @route   POST /api/pets/create
// @access  Private
exports.createPet = async (req, res) => {
  try {
    const {
      petName,
      type,
      breed,
      age,
      gender,
      color,
      medicalHistory,
      allergies,
      emergencyContacts,
      rewardNote,
      qrCodeId, // User provides the QR code ID they received
    } = req.body;

    let qrData = null;
    let finalQRCodeId = qrCodeId;

    // If QR code ID is provided, verify it exists and is available
    if (qrCodeId) {
      const qrInventory = await QRCodeInventory.findOne({ qrCodeId });

      if (!qrInventory) {
        return res.status(404).json({
          success: false,
          error: 'Invalid QR Code ID',
        });
      }

      if (qrInventory.isAssigned) {
        return res.status(400).json({
          success: false,
          error: 'This QR Code has already been assigned to another pet',
        });
      }

      qrData = {
        qrCodeId: qrInventory.qrCodeId,
        qrCodeImage: qrInventory.qrCodeImage,
        publicUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/qr-landing.html?qr=${qrInventory.qrCodeId}`,
        downloadUrl: `${process.env.BASE_URL}${qrInventory.qrCodeImage}`,
      };
    } else {
      // Generate new QR code if no QR code ID provided (backward compatibility)
      finalQRCodeId = generateUniqueId();
      qrData = await generateQRCode(finalQRCodeId, null);
    }

    // Create pet
    const pet = await Pet.create({
      owner: req.user.id,
      petName,
      type,
      breed,
      age,
      gender,
      color,
      qrCodeId: finalQRCodeId,
      qrCodeImage: qrData.qrCodeImage,
      medicalHistory,
      allergies,
      emergencyContacts: emergencyContacts || [],
      rewardNote,
      profileImage: req.file ? req.file.path : null,
    });

    // If using inventory QR code, mark it as assigned
    if (qrCodeId) {
      await QRCodeInventory.findOneAndUpdate(
        { qrCodeId },
        {
          isAssigned: true,
          pet: pet._id,
          assignedAt: Date.now(),
          status: 'assigned',
        }
      );
    }

    res.status(201).json({
      success: true,
      pet,
      qrCode: qrData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update pet profile
// @route   PUT /api/pets/update/:id
// @access  Private
exports.updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

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
        error: 'Not authorized to update this pet',
      });
    }

    // Update fields
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated
    delete updateData.qrCodeId;
    delete updateData.owner;
    delete updateData.qrCodeImage;
    delete updateData._id;
    
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      pet,
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete pet profile
// @route   DELETE /api/pets/delete/:id
// @access  Private
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

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
        error: 'Not authorized to delete this pet',
      });
    }

    await pet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all pets for logged in user
// @route   GET /api/pets/mine
// @access  Private
exports.getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pets.length,
      pets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single pet (protected - owner only)
// @route   GET /api/pets/get/:id
// @access  Private
exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email phone');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    // Make sure user is pet owner
    if (pet.owner._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this pet',
      });
    }

    res.status(200).json({
      success: true,
      pet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get public pet profile by QR code
// @route   GET /api/pets/public/:qrId
// @access  Public
exports.getPublicPetProfile = async (req, res) => {
  try {
    const pet = await Pet.findOne({ qrCodeId: req.params.qrId }).populate(
      'owner',
      'name phone email address'
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    // Increment scan count
    pet.scanCount += 1;

    // Log scan history
    pet.scanHistory.push({
      timestamp: Date.now(),
      ipAddress: req.ip || req.connection.remoteAddress,
      location: 'Unknown', // Can integrate with IP geolocation API
    });

    await pet.save();

    res.status(200).json({
      success: true,
      pet: {
        _id: pet._id,
        petName: pet.petName,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        color: pet.color,
        profileImage: pet.profileImage,
        medicalHistory: pet.medicalHistory,
        allergies: pet.allergies,
        isLost: pet.isLost,
        lastKnownLocation: pet.lastKnownLocation,
        rewardNote: pet.rewardNote,
        qrCodeId: pet.qrCodeId,
      },
      owner: {
        name: pet.owner.name,
        phone: pet.owner.phone,
        email: pet.owner.email,
        address: pet.owner.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Mark pet as lost
// @route   PUT /api/pets/lost/:id
// @access  Private
exports.markAsLost = async (req, res) => {
  try {
    const { lastKnownLocation, rewardNote } = req.body;

    let pet = await Pet.findById(req.params.id);

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

    pet.isLost = true;
    pet.lastKnownLocation = lastKnownLocation || pet.lastKnownLocation;
    pet.rewardNote = rewardNote || pet.rewardNote;
    await pet.save();

    // Send email notification
    const user = await User.findById(req.user.id);
    try {
      await sendEmail({
        email: user.email,
        subject: `${pet.petName} marked as LOST`,
        html: emailTemplates.petLost(pet.petName, pet.profileImage),
      });
    } catch (emailError) {
      console.error('Failed to send lost notification email:', emailError);
    }

    res.status(200).json({
      success: true,
      pet,
      message: 'Pet marked as lost. You will be notified when someone finds them.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Report found pet
// @route   POST /api/pets/found/:qrId
// @access  Public
exports.reportFoundPet = async (req, res) => {
  try {
    const { finderName, finderEmail, finderPhone, location, message } = req.body;

    const pet = await Pet.findOne({ qrCodeId: req.params.qrId }).populate('owner');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    // Create found report
    const foundReport = await FoundReport.create({
      pet: pet._id,
      finderName,
      finderEmail,
      finderPhone,
      location,
      message,
    });

    // Send notification to owner
    try {
      await sendEmail({
        email: pet.owner.email,
        subject: `Great News! Someone found ${pet.petName}!`,
        html: emailTemplates.petFound(
          pet.petName,
          location,
          message || 'No message provided',
          finderPhone
        ),
      });
    } catch (emailError) {
      console.error('Failed to send found notification email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Thank you! The owner has been notified.',
      foundReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Add vaccination record
// @route   POST /api/pets/:id/vaccination
// @access  Private
exports.addVaccination = async (req, res) => {
  try {
    const { vaccineName, date, nextDueDate, veterinarian, notes } = req.body;

    const pet = await Pet.findById(req.params.id);

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

    // Add vaccination record
    pet.vaccinationRecords.push({
      vaccineName,
      date,
      nextDueDate,
      veterinarian,
      notes,
    });

    await pet.save();

    // Create reminder if nextDueDate is provided
    if (nextDueDate) {
      await VaccineReminder.create({
        pet: pet._id,
        owner: req.user.id,
        vaccineName,
        dueDate: nextDueDate,
      });
    }

    res.status(200).json({
      success: true,
      pet,
      message: 'Vaccination record added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get pet statistics
// @route   GET /api/pets/:id/stats
// @access  Private
exports.getPetStats = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

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

    const stats = {
      totalScans: pet.scanCount,
      recentScans: pet.scanHistory.slice(-10).reverse(),
      vaccinationCount: pet.vaccinationRecords.length,
      isLost: pet.isLost,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
