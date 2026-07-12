const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
  try {
    const filter = { isVisible: true };
    const members = await TeamMember.find(filter).sort({ displayOrder: 1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single member by slug
// @route   GET /api/members/:slug
// @access  Public
const getMemberBySlug = async (req, res) => {
  try {
    const member = await TeamMember.findOne({ slug: req.params.slug, isVisible: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all members (admin)
// @route   GET /api/admin/members
// @access  Private
const getAllMembersAdmin = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ displayOrder: 1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create team member
// @route   POST /api/admin/members
// @access  Private
const createMember = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to create team members.' });
    }

    const data = { ...req.body };
    if (req.file) data.profileImage = `/uploads/${req.file.filename}`;
    if (data.skills && typeof data.skills === 'string') data.skills = JSON.parse(data.skills);
    if (data.contributions && typeof data.contributions === 'string') data.contributions = JSON.parse(data.contributions);
    if (data.responsibilities && typeof data.responsibilities === 'string') data.responsibilities = JSON.parse(data.responsibilities);
    if (data.areasOfInterest && typeof data.areasOfInterest === 'string') data.areasOfInterest = JSON.parse(data.areasOfInterest);
    if (data.currentLearning && typeof data.currentLearning === 'string') data.currentLearning = JSON.parse(data.currentLearning);
    if (data.filterCategory && typeof data.filterCategory === 'string') data.filterCategory = JSON.parse(data.filterCategory);

    const member = await TeamMember.create(data);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update team member
// @route   PUT /api/admin/members/:id
// @access  Private
const updateMember = async (req, res) => {
  try {
    const existingMember = await TeamMember.findById(req.params.id);
    if (!existingMember) return res.status(404).json({ success: false, message: 'Member not found' });

    if (req.admin.role !== 'admin' && existingMember.email !== req.admin.email) {
      return res.status(403).json({ success: false, message: 'You are only authorized to update your own profile.' });
    }

    const data = { ...req.body };
    if (req.file) data.profileImage = `/uploads/${req.file.filename}`;
    if (data.skills && typeof data.skills === 'string') data.skills = JSON.parse(data.skills);
    if (data.contributions && typeof data.contributions === 'string') data.contributions = JSON.parse(data.contributions);
    if (data.responsibilities && typeof data.responsibilities === 'string') data.responsibilities = JSON.parse(data.responsibilities);
    if (data.areasOfInterest && typeof data.areasOfInterest === 'string') data.areasOfInterest = JSON.parse(data.areasOfInterest);
    if (data.currentLearning && typeof data.currentLearning === 'string') data.currentLearning = JSON.parse(data.currentLearning);
    if (data.filterCategory && typeof data.filterCategory === 'string') data.filterCategory = JSON.parse(data.filterCategory);

    // If the logged-in user is not admin, prevent them from changing their visibility or displayOrder
    if (req.admin.role !== 'admin') {
      delete data.isVisible;
      delete data.displayOrder;
    }

    const member = await TeamMember.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete team member
// @route   DELETE /api/admin/members/:id
// @access  Private
const deleteMember = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to delete team members.' });
    }

    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMembers, getMemberBySlug, getAllMembersAdmin, createMember, updateMember, deleteMember };
