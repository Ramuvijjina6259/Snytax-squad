const SiteSettings = require('../models/SiteSettings');

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to update settings.' });
    }
    const data = { ...req.body };
    if (req.file) data.logo = `/uploads/${req.file.filename}`;
    if (data.socialLinks && typeof data.socialLinks === 'string') data.socialLinks = JSON.parse(data.socialLinks);
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(data);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, data, { new: true });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
