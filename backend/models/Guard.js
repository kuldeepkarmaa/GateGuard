const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
  joiningDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Guard', guardSchema);