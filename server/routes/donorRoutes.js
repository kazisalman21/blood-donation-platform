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
    searchDonors,
    getNotifications,
    markAsRead
} = require('../controllers/donorController');

// Public routes
router.post('/register', registerDonor);
router.post('/login', loginDonor);

// Protected routes
router.get('/search', protect, searchDonors);
router.get('/:id/notifications', protect, getNotifications);
router.put('/notifications/:notifId/read', protect, markAsRead);
router.get('/:id', protect, getDonorProfile);
router.put('/:id', protect, updateDonorProfile);
router.put('/:id/availability', protect, toggleAvailability);
router.post('/:id/verify', protect, applyForVerification);

module.exports = router;
