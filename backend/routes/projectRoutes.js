const express = require('express');
const router = express.Router();
const { getProjects, getProjectBySlug, createProject, updateProject, deleteProject, getDashboardStats } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin
router.get('/admin/stats', protect, getDashboardStats);
router.post('/admin/create', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), createProject);
router.put('/admin/:id', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), updateProject);
router.delete('/admin/:id', protect, deleteProject);

module.exports = router;
