const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static dynamic uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visitor', require('./routes/visitorRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/notice', require('./routes/noticeRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GateGuard Production Server running on port ${PORT}`);
});