const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  name: { type: String },
  role: { type: String },
  workCompleted: [{ type: String }],
  technologies: [{ type: String }],
  status: { type: String, enum: ['Completed', 'In Progress', 'Planned'], default: 'In Progress' },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  coverImage: { type: String, default: '' },
  screenshots: [{ type: String }],
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  problemStatement: { type: String },
  proposedSolution: { type: String },
  objectives: [{ type: String }],
  features: [{ type: String }],
  technologies: [{ type: String }],
  category: {
    type: String,
    enum: ['Web Development', 'Full Stack', 'Artificial Intelligence', 'Machine Learning', 'Healthcare', 'Education', 'Mobile Applications', 'Messaging Platform', 'Other'],
    default: 'Web Development',
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Testing', 'Completed', 'Deployed', 'Maintenance'],
    default: 'Planning',
  },
  contributors: [contributorSchema],
  githubUrl: { type: String, default: '' },
  liveDemoUrl: { type: String, default: '' },
  documentationUrl: { type: String, default: '' },
  challenges: [{ type: String }],
  futureImprovements: [{ type: String }],
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  isFeatured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = require('../utils/mockMongoose').getModel('Project', Project);
