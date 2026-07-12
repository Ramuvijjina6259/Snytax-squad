const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  teamName: { type: String, default: 'Syntax Squad' },
  logo: { type: String, default: '' },
  tagline: { type: String, default: 'Building Ideas. Creating Solutions. Growing Together.' },
  description: { type: String, default: 'A passionate team of software developers dedicated to building innovative solutions.' },
  mission: { type: String, default: 'To develop innovative and impactful software solutions that solve real-world problems.' },
  vision: { type: String, default: 'To become a leading software development team known for quality, innovation, and collaboration.' },
  email: { type: String, default: 'syntaxsquad@gmail.com' },
  location: { type: String, default: 'Andhra Pradesh, India' },
  socialLinks: {
    github: { type: String, default: 'https://github.com/syntax-squad' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  heroText: { type: String, default: 'We build modern, scalable applications using cutting-edge technologies.' },
  footerText: { type: String, default: 'Designed and developed by Syntax Squad.' },
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
module.exports = require('../utils/mockMongoose').getModel('SiteSettings', SiteSettings);
