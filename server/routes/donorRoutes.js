const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
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

// Rate limiters (Bug Fix: brute-force protection)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 login attempts per window
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 registration attempts per window
    message: { message: 'Too many registration attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Public routes (with rate limiting)
router.post('/register', registerLimiter, registerDonor);
router.post('/login', loginLimiter, loginDonor);

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
