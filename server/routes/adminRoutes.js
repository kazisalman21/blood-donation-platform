const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminOnly');
const {
    getAllUsers,
    suspendUser,
    approveVerification,
    getBloodInventory,
    getRequestAnalytics,
    getDonationAnalytics,
    getMatchRate,
    getResponseTime,
    sendBroadcast,
    getBroadcastHistory,
    createFAQ,
    updateFAQ,
    deleteFAQ
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect);
router.use(adminOnly);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/verify', approveVerification);

// Blood inventory
router.get('/inventory', getBloodInventory);

// Analytics
router.get('/analytics/requests', getRequestAnalytics);
router.get('/analytics/donations', getDonationAnalytics);
router.get('/analytics/matchrate', getMatchRate);
router.get('/analytics/responsetime', getResponseTime);

// Broadcast
router.post('/broadcast', sendBroadcast);
router.get('/broadcast/history', getBroadcastHistory);

// FAQ management
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

module.exports = router;
