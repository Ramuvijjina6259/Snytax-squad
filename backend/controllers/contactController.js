const ContactMessage = require('../models/ContactMessage');

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to view contact messages.' });
    }
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to update message status.' });
    }
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only superadmin is authorized to delete messages.' });
    }
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact, getMessages, updateMessageStatus, deleteMessage };
