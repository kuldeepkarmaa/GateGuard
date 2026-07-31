const express = require('express');
const router = express.Router();
const { preApproveVisitor, verifyOTP, checkoutVisitor, getVisitors } = require('../controllers/visitorController');
const auth = require('../middleware/authMiddleware');

router.post('/pre-approve', auth, preApproveVisitor);
router.post('/verify-otp', auth, verifyOTP);
router.put('/checkout/:id', auth, checkoutVisitor);
router.get('/', auth, getVisitors);

module.exports = router;