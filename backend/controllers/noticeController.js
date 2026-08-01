const Notice = require('../models/Notice');

// Create Digital Notice (Admin Only)
exports.createNotice = async (req, res) => {
  try {
    const { title, description, isPinned } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and Description are required fields.' 
      });
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
    console.error('Notice Creation Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to publish notice' 
    });
  }
};

// Get All Notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('createdBy', 'name')
      .sort({ isPinned: -1, createdAt: -1 });

    return res.status(200).json({ success: true, count: notices.length, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};