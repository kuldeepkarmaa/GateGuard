const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatNumber: { type: String, required: true },
  block: { type: String, required: true },
  vehicleNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);