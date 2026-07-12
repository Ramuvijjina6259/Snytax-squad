const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (req.body.name) admin.name = req.body.name;
    if (req.body.email) admin.email = req.body.email;
    if (req.body.password) admin.password = req.body.password;
    if (req.file) admin.profileImage = `/uploads/${req.file.filename}`;
    await admin.save();
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginAdmin, getMe, updateProfile };
