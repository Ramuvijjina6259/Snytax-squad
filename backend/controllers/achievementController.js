const Achievement = require('../models/Achievement');

const getAchievements = async (req, res) => {
  try {
    const { type, member } = req.query;
    let filter = {};
    if (type) filter.type = type;
    if (member) filter.member = member;

    // Check if it's an authenticated admin request from a member role
    let requestingAdmin = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const Admin = require('../models/Admin');
        requestingAdmin = await Admin.findById(decoded.id);
      } catch (err) {
        // Ignore token decode error for public requests
      }
    }

    if (requestingAdmin && requestingAdmin.role !== 'admin') {
      const TeamMember = require('../models/TeamMember');
      const memberRecord = await TeamMember.findOne({ email: requestingAdmin.email });
      if (memberRecord) {
        filter.member = memberRecord._id.toString();
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    const achievements = await Achievement.find(filter).populate('member', 'name slug profileImage').sort({ date: -1 });
    res.json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAchievement = async (req, res) => {
  try {
    const data = { ...req.body };
    
    if (req.admin.role !== 'admin') {
      const TeamMember = require('../models/TeamMember');
      const memberRecord = await TeamMember.findOne({ email: req.admin.email });
      if (!memberRecord || memberRecord._id.toString() !== data.member) {
        return res.status(403).json({ success: false, message: 'You can only add achievements for yourself.' });
      }
    }

    if (req.file) data.certificateImage = `/uploads/${req.file.filename}`;
    const achievement = await Achievement.create(data);
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });

    if (req.admin.role !== 'admin') {
      const TeamMember = require('../models/TeamMember');
      const memberRecord = await TeamMember.findOne({ email: req.admin.email });
      if (!memberRecord || achievement.member.toString() !== memberRecord._id.toString()) {
        return res.status(403).json({ success: false, message: 'You can only update your own achievements.' });
      }
    }

    const data = { ...req.body };
    if (req.file) data.certificateImage = `/uploads/${req.file.filename}`;
    const updated = await Achievement.findByIdAndUpdate(req.params.id, data, { new: true }).populate('member', 'name slug');
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });

    if (req.admin.role !== 'admin') {
      const TeamMember = require('../models/TeamMember');
      const memberRecord = await TeamMember.findOne({ email: req.admin.email });
      if (!memberRecord || achievement.member.toString() !== memberRecord._id.toString()) {
        return res.status(403).json({ success: false, message: 'You can only delete your own achievements.' });
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAchievements, createAchievement, updateAchievement, deleteAchievement };
