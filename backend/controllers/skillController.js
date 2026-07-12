const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate('members', 'name slug profileImage role');
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSkill = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to create skills.' });
    }
    const data = { ...req.body };
    if (data.members && typeof data.members === 'string') data.members = JSON.parse(data.members);
    const skill = await Skill.create(data);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to update skills.' });
    }
    const data = { ...req.body };
    if (data.members && typeof data.members === 'string') data.members = JSON.parse(data.members);
    const skill = await Skill.findByIdAndUpdate(req.params.id, data, { new: true }).populate('members', 'name slug profileImage');
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to delete skills.' });
    }
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
