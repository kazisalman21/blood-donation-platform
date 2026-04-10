const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerDonor,
    loginDonor,
    getDonorProfile,
    updateDonorProfile,
    toggleAvailability,
    applyForVerification,
    searchDonors
} = require('../controllers/donorController');
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} = require('../controllers/notificationController');

// Public routes
router.post('/register', registerDonor);
router.post('/login', loginDonor);

// Protected routes
router.get('/search', protect, searchDonors);

// Notification routes (before /:id to avoid param conflict)
router.get('/:id/notifications/count', protect, getUnreadCount);
router.get('/:id/notifications', protect, getNotifications);
router.put('/notifications/:notifId/read', protect, markAsRead);
router.put('/notifications/read-all', protect, markAllAsRead);

router.get('/:id', protect, getDonorProfile);
router.put('/:id', protect, updateDonorProfile);
router.put('/:id/availability', protect, toggleAvailability);
router.post('/:id/verify', protect, applyForVerification);

module.exports = router;
