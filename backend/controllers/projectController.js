const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const { category, status, search, featured } = req.query;
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { technologies: { $in: [new RegExp(search, 'i')] } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
    const projects = await Project.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to create projects.' });
    }
    const data = { ...req.body };
    if (req.files) {
      if (req.files.coverImage) data.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      if (req.files.screenshots) data.screenshots = req.files.screenshots.map(f => `/uploads/${f.filename}`);
    }
    const parseIfString = (field) => typeof field === 'string' ? JSON.parse(field) : field;
    ['technologies', 'objectives', 'features', 'contributors', 'challenges', 'futureImprovements'].forEach(key => {
      if (data[key]) data[key] = parseIfString(data[key]);
    });
    const project = await Project.create(data);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to update projects.' });
    }
    const data = { ...req.body };
    if (req.files) {
      if (req.files.coverImage) data.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      if (req.files.screenshots) data.screenshots = req.files.screenshots.map(f => `/uploads/${f.filename}`);
    }
    const parseIfString = (field) => typeof field === 'string' ? JSON.parse(field) : field;
    ['technologies', 'objectives', 'features', 'contributors', 'challenges', 'futureImprovements'].forEach(key => {
      if (data[key]) data[key] = parseIfString(data[key]);
    });
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to delete projects.' });
    }
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalProjects, completedProjects, inProgress, teamMembers, achievements, messages] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Completed' }),
      Project.countDocuments({ status: 'In Progress' }),
      require('../models/TeamMember').countDocuments(),
      require('../models/Achievement').countDocuments(),
      require('../models/ContactMessage').countDocuments({ status: 'unread' }),
    ]);
    res.json({
      success: true,
      data: { totalProjects, completedProjects, inProgress, teamMembers, achievements, unreadMessages: messages },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject, getDashboardStats };
