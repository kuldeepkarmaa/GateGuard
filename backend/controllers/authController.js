const User = require('../models/User');
const Resident = require('../models/Resident');
const Guard = require('../models/Guard');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, flatNumber, block, vehicleNumber, shift } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'Resident'
    });

    // Create role-specific profile
    if (user.role === 'Resident') {
      await Resident.create({
        userId: user._id,
        flatNumber: flatNumber || 'N/A',
        block: block || 'A',
        vehicleNumber: vehicleNumber || ''
      });
    } else if (user.role === 'Guard') {
      await Guard.create({
        userId: user._id,
        shift: shift || 'Morning'
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    let profileData = {};
    if (user.role === 'Resident') {
      profileData = await Resident.findOne({ userId: user._id });
    } else if (user.role === 'Guard') {
      profileData = await Guard.findOne({ userId: user._id });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: profileData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};