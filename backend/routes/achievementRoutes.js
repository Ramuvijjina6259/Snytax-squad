const express = require('express');
const router = express.Router();
const { getAchievements, createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAchievements);
router.post('/admin/create', protect, upload.single('certificateImage'), createAchievement);
router.put('/admin/:id', protect, upload.single('certificateImage'), updateAchievement);
router.delete('/admin/:id', protect, deleteAchievement);

module.exports = router;
