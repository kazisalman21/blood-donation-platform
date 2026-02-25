const Donation = require('../models/Donation');
const BloodRequest = require('../models/BloodRequest');
const Feedback = require('../models/Feedback');
const FAQ = require('../models/FAQ');

// @desc    Get donation history for a donor
// @route   GET /api/community/donors/:id/history
// @access  Private
const getDonationHistory = async (req, res) => {
    try {
        const { from, to, bloodType, status } = req.query;
        const query = { donorId: req.params.id };

        if (bloodType) query.bloodType = bloodType;
        if (status) query.status = status;
        if (from || to) {
            query.donationDate = {};
            if (from) query.donationDate.$gte = new Date(from);
            if (to) query.donationDate.$lte = new Date(to);
        }

        const donations = await Donation.find(query)
            .sort({ donationDate: -1 })
            .populate('requestId', 'hospital urgency');

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get donation statistics for a donor
// @route   GET /api/community/donors/:id/stats
// @access  Private
const getDonorStats = async (req, res) => {
    try {
        const donorId = req.params.id;

        const totalDonations = await Donation.countDocuments({
            donorId,
            status: 'Completed'
        });

        // Monthly breakdown (last 12 months)
        const monthlyBreakdown = await Donation.aggregate([
            {
                $match: {
                    donorId: require('mongoose').Types.ObjectId.createFromHexString(donorId),
                    status: 'Completed'
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$donationDate' },
                        month: { $month: '$donationDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.json({
            totalDonations,
            livesHelped: totalDonations, // 1 donation = 1 life helped
            monthlyBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get request history for a requester
// @route   GET /api/community/requesters/:id/history
// @access  Private
const getRequesterHistory = async (req, res) => {
    try {
        const { from, to, bloodType, status } = req.query;
        const query = { requesterId: req.params.id };

        if (bloodType) query.bloodType = bloodType;
        if (status) query.status = status;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const requests = await BloodRequest.find(query)
            .populate('matchedDonorId', 'name bloodType isVerified')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get leaderboard
// @route   GET /api/community/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const { type, city } = req.query;
        const matchStage = {};

        if (city) matchStage['donor.city'] = city;

        // Monthly filter
        if (type === 'monthly') {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            matchStage.donationDate = { $gte: startOfMonth };
        }

        const pipeline = [
            { $match: { status: 'Completed', ...(matchStage.donationDate ? { donationDate: matchStage.donationDate } : {}) } },
            { $group: { _id: '$donorId', totalDonations: { $sum: 1 } } },
            { $sort: { totalDonations: -1 } },
            { $limit: 20 },
            {
                $lookup: {
                    from: 'donors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'donor'
                }
            },
            { $unwind: '$donor' },
            ...(city ? [{ $match: { 'donor.city': city } }] : []),
            {
                $project: {
                    _id: 1,
                    totalDonations: 1,
                    'donor.name': 1,
                    'donor.bloodType': 1,
                    'donor.city': 1,
                    'donor.isVerified': 1,
                    'donor.badges': 1,
                    'donor.donationCount': 1
                }
            }
        ];

        const leaders = await Donation.aggregate(pipeline);
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Submit feedback
// @route   POST /api/community/feedback
// @access  Private
const submitFeedback = async (req, res) => {
    try {
        const { donorId, requestId, rating, message, allowPublic } = req.body;

        // Check that the request is completed
        const request = await BloodRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (request.status !== 'Completed') {
            return res.status(400).json({ message: 'Feedback can only be submitted for completed donations' });
        }

        // Only the requester can submit feedback
        if (request.requesterId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the requester can submit feedback' });
        }

        const feedback = await Feedback.create({
            donorId,
            requestId,
            rating,
            message,
            allowPublic
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get feedback for a donor (public only)
// @route   GET /api/community/feedback/donor/:id
// @access  Public
const getDonorFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({
            donorId: req.params.id,
            allowPublic: true
        }).sort({ createdAt: -1 });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all FAQs (public)
// @route   GET /api/community/faqs
// @access  Public
const getFAQs = async (req, res) => {
    try {
        const { category } = req.query;
        const query = { isActive: true };
        if (category) query.category = category;

        const faqs = await FAQ.find(query).sort({ order: 1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDonationHistory,
    getDonorStats,
    getRequesterHistory,
    getLeaderboard,
    submitFeedback,
    getDonorFeedback,
    getFAQs
};
