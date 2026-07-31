const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/', auth, upload.single('image'), createComplaint);
router.get('/', auth, getComplaints);
router.put('/:id', auth, updateComplaintStatus);

module.exports = router;