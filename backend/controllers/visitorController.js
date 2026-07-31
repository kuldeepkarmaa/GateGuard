const Visitor = require('../models/Visitor');
const Resident = require('../models/Resident');

// Generate Pre-Approved Visitor Pass with OTP (Resident)
exports.preApproveVisitor = async (req, res) => {
  try {
    const { name, phone, purpose } = req.body;
    
    // Find resident profile linked to authenticated user
    const resident = await Resident.findOne({ userId: req.user.id });
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident profile not found' });
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const visitor = await Visitor.create({
      name,
      phone,
      purpose,
      residentId: resident._id,
      otp: generatedOtp,
      status: 'Pre-Approved'
    });

    res.status(201).json({
      success: true,
      message: 'Visitor Pass generated successfully',
      visitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP at Gate (Guard)
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const visitor = await Visitor.findOne({ otp, status: { $in: ['Pre-Approved', 'Pending Approval'] } });
    if (!visitor) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    visitor.status = 'Checked-In';
    visitor.entryTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      message: 'OTP Verified! Entry Allowed.',
      visitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Visitor Exit / Checkout (Guard)
exports.checkoutVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor record not found' });
    }

    visitor.status = 'Checked-Out';
    visitor.exitTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      message: 'Visitor checked out successfully',
      visitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Visitors List (Role-Based Dynamic Queries)
exports.getVisitors = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Resident') {
      const resident = await Resident.findOne({ userId: req.user.id });
      if (resident) query.residentId = resident._id;
    }

    const visitors = await Visitor.find(query)
      .populate({ path: 'residentId', populate: { path: 'userId', select: 'name phone' } })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: visitors.length, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};