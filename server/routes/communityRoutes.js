const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getDonationHistory,
    getDonorStats,
    getRequesterHistory,
    getLeaderboard,
    submitFeedback,
    getDonorFeedback,
    getFAQs
} = require('../controllers/communityController');

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/feedback/donor/:id', getDonorFeedback);
router.get('/faqs', getFAQs);

// Protected routes
router.get('/donors/:id/history', protect, getDonationHistory);
router.get('/donors/:id/stats', protect, getDonorStats);
router.get('/requesters/:id/history', protect, getRequesterHistory);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
