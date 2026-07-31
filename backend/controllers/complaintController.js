const Complaint = require('../models/Complaint');
const Resident = require('../models/Resident');

// 1. Create Complaint (Only Residents)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const resident = await Resident.findOne({ userId: req.user.id });
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident profile not found' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      residentId: resident._id,
      title,
      description,
      priority: priority || 'Medium',
      image: imagePath
    });

    res.status(201).json({ success: true, message: 'Complaint lodged successfully', complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Complaints (Fixed for Admin/Guard/Resident)
exports.getComplaints = async (req, res) => {
  try {
    let query = {};

    // Strictly check role: search Resident profile ONLY if user role is Resident
    if (req.user && req.user.role === 'Resident') {
      const resident = await Resident.findOne({ userId: req.user.id });
      if (!resident) {
        return res.status(404).json({ success: false, message: 'Resident profile not found' });
      }
      query.residentId = resident._id;
    }

    // Admin & Guard will bypass the resident check and fetch all society complaints
    const complaints = await Complaint.find(query)
      .populate({ 
        path: 'residentId', 
        populate: { path: 'userId', select: 'name phone' } 
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Status (Admin Only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, message: `Status updated to ${status}`, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};