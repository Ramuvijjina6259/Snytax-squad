const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.put('/admin/update', protect, upload.single('logo'), updateSettings);

module.exports = router;
