const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// Safety Check: Verify functions exist before passing to router
if (!complaintController.createComplaint || !complaintController.getComplaints) {
  console.error("❌ Error: Functions in complaintController are undefined!");
}

router.post('/', auth, upload.single('image'), complaintController.createComplaint);
router.get('/', auth, complaintController.getComplaints);
router.put('/:id', auth, complaintController.updateComplaintStatus);

module.exports = router;