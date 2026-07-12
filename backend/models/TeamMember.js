const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  category: { type: String },
});

const contributionSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  role: { type: String },
  tasks: [{ type: String }],
  technologies: [{ type: String }],
  contributionLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Lead'], default: 'Medium' },
  status: { type: String, enum: ['Completed', 'In Progress', 'Planned'], default: 'In Progress' },
});

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  profileImage: { type: String, default: '' },
  role: { type: String, required: true },
  shortBio: { type: String },
  fullBio: { type: String },
  email: { type: String },
  location: { type: String, default: 'India' },
  careerObjective: { type: String },
  responsibilities: [{ type: String }],
  areasOfInterest: [{ type: String }],
  currentLearning: [{ type: String }],
  skills: [skillSchema],
  portfolioUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  contributions: [contributionSchema],
  availability: { type: String, enum: ['Available', 'Busy', 'Open to Opportunities'], default: 'Open to Opportunities' },
  displayOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  filterCategory: [{ type: String }],
  projectCount: { type: Number, default: 0 },
}, { timestamps: true });

teamMemberSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
module.exports = require('../utils/mockMongoose').getModel('TeamMember', TeamMember);
