const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createRequest,
    getRequest,
    getRequests,
    respondToRequest,
    requesterConsent,
    updateStatus,
    getContactInfo
} = require('../controllers/requestController');

// All routes require authentication
router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequest);
router.put('/:id/respond', protect, respondToRequest);
router.put('/:id/consent', protect, requesterConsent);
router.put('/:id/status', protect, updateStatus);
router.get('/:id/contact', protect, getContactInfo);

module.exports = router;
