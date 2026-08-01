const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, required: true },
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  otp: { type: String },
  status: { 
    type: String, 
    enum: ['Pre-Approved', 'Pending Approval', 'Approved', 'Checked-In', 'Checked-Out', 'Rejected'],
    default: 'Pending Approval' 
  },
  entryTime: { type: Date },
  exitTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);