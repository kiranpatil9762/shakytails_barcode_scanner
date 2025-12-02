const User = require('../models/User');
const Pet = require('../models/Pet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if credentials match admin credentials from env
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials',
      });
    }

    // Find or create admin user
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!admin) {
      // Create admin user
      admin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        phone: '0000000000',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Get all users
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    // Get pet count for each user
    const usersWithPetCount = await Promise.all(
      users.map(async (user) => {
        const petCount = await Pet.countDocuments({ owner: user._id });
        return {
          ...user.toObject(),
          petCount
        };
      })
    );

    const total = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      success: true,
      count: usersWithPetCount.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users: usersWithPetCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all pets
// @route   GET /api/admin/pets OR /api/admin/all-pets
// @access  Private (Admin only)
exports.getAllPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Get all pets
    const skip = (page - 1) * limit;

    const pets = await Pet.find()
      .populate('owner', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Pet.countDocuments();

    res.status(200).json({
      success: true,
      count: pets.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      pets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single user with pets
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const pets = await Pet.find({ owner: user._id });

    res.status(200).json({
      success: true,
      user,
      pets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete admin users',
      });
    }

    // Delete all pets belonging to this user
    await Pet.deleteMany({ owner: user._id });

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and associated pets deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/admin/pets/:id
// @access  Private (Admin only)
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
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

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPets = await Pet.countDocuments();
    const lostPets = await Pet.countDocuments({ isLost: true });
    const totalScans = await Pet.aggregate([
      {
        $group: {
          _id: null,
          totalScans: { $sum: '$scanCount' },
        },
      },
    ]);

    // Recent registrations
    const recentUsers = await User.find({ role: 'user' })
      .select('name email createdAt')
      .sort('-createdAt')
      .limit(5);

    const recentPets = await Pet.find()
      .populate('owner', 'name email')
      .select('petName type createdAt owner')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPets,
        lostPets,
        totalScans: totalScans[0]?.totalScans || 0,
      },
      recentUsers,
      recentPets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (Admin only)
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
