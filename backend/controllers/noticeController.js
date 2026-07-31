const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  try {
    const { title, description, isPinned } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required fields.' });
    }

    const notice = await Notice.create({
      title,
      description,
      isPinned: Boolean(isPinned),
      createdBy: req.user ? req.user.id : null
    });

    return res.status(201).json({
      success: true,
      message: 'Notice broadcasted successfully',
      notice
    });
  } catch (error) {
    console.error('Notice Publish Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ isPinned: -1, createdAt: -1 });
    return res.status(200).json({ success: true, count: notices.length, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};