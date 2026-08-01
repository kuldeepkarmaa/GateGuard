const Visitor = require('../models/Visitor');
const Resident = require('../models/Resident');

// 1. Generate Pre-Approved Visitor Pass with OTP (Resident)
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

// 2. Verify OTP at Gate (Guard)
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const visitor = await Visitor.findOne({ 
      otp, 
      status: { $in: ['Pre-Approved', 'Pending Approval', 'Approved'] } 
    });

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

// 3. Visitor Exit / Checkout (Guard)
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

// 4. Get Visitors List (Role-Based Dynamic Queries)
exports.getVisitors = async (req, res) => {
  try {
    let query = {};

    // If logged-in user is Resident, fetch visitors belonging ONLY to their resident profile
    if (req.user && req.user.role === 'Resident') {
      const resident = await Resident.findOne({ userId: req.user.id });
      if (resident) query.residentId = resident._id;
    }

    // Admin & Guard will fetch all society visitor entries
    const visitors = await Visitor.find(query)
      .populate({ 
        path: 'residentId', 
        populate: { path: 'userId', select: 'name phone' } 
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: visitors.length, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Guard Requests Entry for Unannounced Visitor (Supports Flat No. / Block OR residentId)
exports.requestEntry = async (req, res) => {
  try {
    const { name, phone, purpose, residentId, flatNumber, block } = req.body;

    let targetResidentId = residentId;

    // If Flat Number is provided by Guard, search for the Resident profile dynamically
    if (!targetResidentId && flatNumber) {
      const resident = await Resident.findOne({
        flatNumber: flatNumber.toString().trim(),
        block: block ? block.toString().trim() : 'A'
      });

      if (!resident) {
        return res.status(404).json({ 
          success: false, 
          message: `No resident registered at Flat ${flatNumber} (Block ${block || 'A'})` 
        });
      }

      targetResidentId = resident._id;
    }

    if (!targetResidentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either Flat Number or Resident ID' 
      });
    }

    const visitor = await Visitor.create({
      name,
      phone,
      purpose: purpose || 'Guest',
      residentId: targetResidentId,
      status: 'Pending Approval'
    });

    res.status(201).json({
      success: true,
      message: 'Access request sent to Resident successfully',
      visitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Resident Approves or Rejects Visitor Request
exports.respondToVisitorRequest = async (req, res) => {
  try {
    const { visitorId, status } = req.body; // status: 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status choice' });
    }

    const visitor = await Visitor.findByIdAndUpdate(
      visitorId,
      { status },
      { returnDocument: 'after' }
    );

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor request not found' });
    }

    res.status(200).json({
      success: true,
      message: `Visitor request has been ${status.toLowerCase()}`,
      visitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};