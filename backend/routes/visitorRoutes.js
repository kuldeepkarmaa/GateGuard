const express = require('express');
const router = express.Router();
const { 
  preApproveVisitor, 
  verifyOTP, 
  checkoutVisitor, 
  getVisitors, 
  requestEntry, 
  respondToVisitorRequest 
} = require('../controllers/visitorController');
const auth = require('../middleware/authMiddleware');

router.post('/pre-approve', auth, preApproveVisitor);
router.post('/verify-otp', auth, verifyOTP);
router.post('/request-entry', auth, requestEntry);
router.post('/respond', auth, respondToVisitorRequest);
router.put('/checkout/:id', auth, checkoutVisitor);
router.get('/', auth, getVisitors);

module.exports = router;