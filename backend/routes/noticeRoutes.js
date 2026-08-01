const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createNotice);
router.get('/', getNotices);
router.delete('/:id', auth, deleteNotice);

module.exports = router;