const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String },
  date: { type: Date },
  description: { type: String },
  type: {
    type: String,
    enum: ['Certification', 'Hackathon', 'Workshop', 'Award', 'Internship', 'Project Milestone', 'College Achievement', 'Competition', 'Other'],
    default: 'Certification',
  },
  certificateImage: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  memberName: { type: String },
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = require('../utils/mockMongoose').getModel('Achievement', Achievement);
