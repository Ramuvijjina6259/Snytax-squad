const express = require('express');
const router = express.Router();
const { loginAdmin, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;
