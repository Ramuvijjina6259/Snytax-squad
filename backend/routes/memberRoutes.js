const express = require('express');
const router = express.Router();
const { getMembers, getMemberBySlug, getAllMembersAdmin, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getMembers);
router.get('/:slug', getMemberBySlug);

// Admin
router.get('/admin/all', protect, getAllMembersAdmin);
router.post('/admin/create', protect, upload.single('profileImage'), createMember);
router.put('/admin/:id', protect, upload.single('profileImage'), updateMember);
router.delete('/admin/:id', protect, deleteMember);

module.exports = router;
