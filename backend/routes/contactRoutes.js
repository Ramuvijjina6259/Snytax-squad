const express = require('express');
const router = express.Router();
const { submitContact, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/admin/messages', protect, getMessages);
router.put('/admin/:id', protect, updateMessageStatus);
router.delete('/admin/:id', protect, deleteMessage);

module.exports = router;
