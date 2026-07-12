const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Frontend Development', 'Backend Development', 'Artificial Intelligence', 'Machine Learning', 'Database Management', 'UI/UX Design', 'Deployment', 'Development Tools', 'Programming Languages', 'Soft Skills', 'Other'],
    default: 'Other',
  },
  icon: { type: String, default: '' },
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' }],
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);
module.exports = require('../utils/mockMongoose').getModel('Skill', Skill);
