const express = require('express');
const router = express.Router();
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', getSkills);
router.post('/admin/create', protect, createSkill);
router.put('/admin/:id', protect, updateSkill);
router.delete('/admin/:id', protect, deleteSkill);

module.exports = router;
